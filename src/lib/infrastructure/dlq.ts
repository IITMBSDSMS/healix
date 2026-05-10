/**
 * Enterprise Dead-Letter Queue (DLQ)
 * 
 * Records failed asynchronous jobs or events that could not be processed
 * after maximum retries. We store these in Redis for visibility and
 * potential manual replay.
 */

import { Redis } from '@upstash/redis';
import { createLogger } from './logger';

const logger = createLogger('dlq');

let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  logger.warn('Failed to initialize Upstash Redis for DLQ.', { error });
}

export interface DLQEntry {
  queue: string;
  event: any;
  error: string;
  timestamp?: string;
}

export async function pushToDlq(entry: DLQEntry): Promise<void> {
  const payload = {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  logger.error(`Pushing event to DLQ: ${entry.queue}`, null, payload);

  if (redis) {
    try {
      const key = `dlq:${entry.queue}`;
      // Push to a Redis list
      await redis.lpush(key, payload);
      // Keep only the latest 1000 items per queue to prevent unbounded growth
      await redis.ltrim(key, 0, 999);
    } catch (redisError) {
      logger.error(`Failed to write to Redis DLQ`, redisError);
    }
  } else {
    logger.warn('Redis not configured, DLQ entry was only logged, not persisted.');
  }
}

export async function getDlqEntries(queue: string, limit: number = 50): Promise<DLQEntry[]> {
  if (!redis) {
    return [];
  }
  
  try {
    const key = `dlq:${queue}`;
    const entries = await redis.lrange<DLQEntry>(key, 0, limit - 1);
    return entries;
  } catch (error) {
    logger.error(`Failed to read from Redis DLQ for queue: ${queue}`, error);
    return [];
  }
}
