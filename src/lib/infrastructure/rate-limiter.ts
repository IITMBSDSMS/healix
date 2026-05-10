/**
 * Enterprise Rate Limiter
 * 
 * Uses Upstash Redis for global distributed rate limiting when configured.
 * Falls back to in-memory caching for local development or if Redis is unavailable.
 */

import { Redis } from '@upstash/redis';
import { createLogger } from './logger';

const logger = createLogger('rate-limiter');

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback (per-edge-isolate)
const memoryCache = new Map<string, { count: number; expiresAt: number }>();

// Initialize Redis if credentials exist
let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  logger.warn('Failed to initialize Upstash Redis. Falling back to memory cache.', { error });
}

export async function rateLimit(
  identifier: string,
  limit: number = 60, // Requests per window
  windowSecs: number = 60 // Window size in seconds
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSecs * 1000;
  const key = `ratelimit:${identifier}`;

  if (redis) {
    try {
      const current = await redis.incr(key);
      let reset: number;

      if (current === 1) {
        // First request in window, set expiry
        await redis.expire(key, windowSecs);
        reset = now + windowMs;
      } else {
        // Get TTL for existing window
        const ttl = await redis.pttl(key);
        reset = now + (ttl > 0 ? ttl : windowMs);
      }

      if (current > limit) {
        logger.warn(`Rate limit exceeded via Redis for ${identifier}`, { limit, windowSecs });
        return { success: false, limit, remaining: 0, reset };
      }

      return { success: true, limit, remaining: Math.max(0, limit - current), reset };
    } catch (error) {
      logger.error('Redis rate limit execution failed, falling back to memory', error);
      // Fall through to memory cache below
    }
  }

  // --- In-Memory Fallback ---
  // Clean up stale entries (basic garbage collection for in-memory)
  if (Math.random() < 0.05) {
    for (const [k, v] of memoryCache.entries()) {
      if (v.expiresAt < now) memoryCache.delete(k);
    }
  }

  const record = memoryCache.get(key);

  if (!record || record.expiresAt < now) {
    // New window
    const expiresAt = now + windowMs;
    memoryCache.set(key, { count: 1, expiresAt });
    return { success: true, limit, remaining: limit - 1, reset: expiresAt };
  }

  // Existing window
  if (record.count >= limit) {
    logger.warn(`Rate limit exceeded via Memory for ${identifier}`, { limit, windowSecs });
    return { success: false, limit, remaining: 0, reset: record.expiresAt };
  }

  record.count++;
  memoryCache.set(key, record);

  return { success: true, limit, remaining: limit - record.count, reset: record.expiresAt };
}

