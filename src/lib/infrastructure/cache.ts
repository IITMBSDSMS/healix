/**
 * Enterprise Global Cache
 * 
 * Uses Upstash Redis for distributed caching.
 * Falls back to in-memory caching for local development or if Redis is unavailable.
 */

import { Redis } from '@upstash/redis';
import { createLogger } from './logger';

const logger = createLogger('global-cache');

// In-memory fallback for lists
const memoryLists = new Map<string, any[]>();

// In-memory fallback
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

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
  logger.warn('Failed to initialize Upstash Redis for Cache. Falling back to memory cache.', { error });
}

interface CacheOptions {
  ttlSeconds?: number;
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      const data = await redis.get<T>(key);
      return data ?? null;
    } catch (error) {
      logger.error(`Redis get failed for key: ${key}`, error);
    }
  }

  // Memory fallback
  const record = memoryCache.get(key);
  if (record) {
    if (record.expiresAt < Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    return record.value as T;
  }

  return null;
}

export async function setCache<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
  const ttlSeconds = options?.ttlSeconds ?? 3600; // default 1 hour
  
  if (redis) {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    } catch (error) {
      logger.error(`Redis set failed for key: ${key}`, error);
    }
  }

  // Memory fallback
  const expiresAt = Date.now() + (ttlSeconds * 1000);
  memoryCache.set(key, { value, expiresAt });
  
  // Basic garbage collection for memory cache
  if (Math.random() < 0.05) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (v.expiresAt < now) memoryCache.delete(k);
    }
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (redis) {
    try {
      await redis.del(key);
      return;
    } catch (error) {
      logger.error(`Redis delete failed for key: ${key}`, error);
    }
  }

  memoryCache.delete(key);
}

export async function pushToList<T>(key: string, value: T): Promise<void> {
  if (redis) {
    try {
      await redis.lpush(key, value);
      return;
    } catch (error) {
      logger.error(`Redis lpush failed for key: ${key}`, error);
    }
  }

  // Memory fallback
  const list = memoryLists.get(key) || [];
  list.unshift(value);
  memoryLists.set(key, list);
}

export async function popFromList<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      const data = await redis.rpop<T>(key);
      return data ?? null;
    } catch (error) {
      logger.error(`Redis rpop failed for key: ${key}`, error);
    }
  }

  // Memory fallback
  const list = memoryLists.get(key);
  if (list && list.length > 0) {
    return list.pop() as T;
  }
  return null;
}
