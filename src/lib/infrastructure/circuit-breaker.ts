/**
 * Enterprise Circuit Breaker Pattern
 * Protects downstream services (like Supabase or AI engines) from cascading failures.
 */

import { createLogger } from './logger';

const logger = createLogger('circuit-breaker');

interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
}

export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount: number = 0;
  private nextAttempt: number = Date.now();
  private options: CircuitBreakerOptions;
  private name: string;

  constructor(name: string, options?: Partial<CircuitBreakerOptions>) {
    this.name = name;
    this.options = {
      failureThreshold: options?.failureThreshold || 5,
      resetTimeoutMs: options?.resetTimeoutMs || 30000, // 30 seconds
    };
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
        logger.info(`Circuit breaker [${this.name}] entering HALF_OPEN state.`);
      } else {
        throw new Error(`CircuitBreaker [${this.name}] is OPEN. Fast failing.`);
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      logger.info(`Circuit breaker [${this.name}] CLOSED. Service recovered.`);
    }
  }

  private onFailure(error: unknown) {
    this.failureCount++;
    logger.warn(`Circuit breaker [${this.name}] failure (${this.failureCount}/${this.options.failureThreshold})`, { error });

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.options.resetTimeoutMs;
      logger.error(`Circuit breaker [${this.name}] OPENED. Pausing requests for ${this.options.resetTimeoutMs}ms`);
    }
  }
}
