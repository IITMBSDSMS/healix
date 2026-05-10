import crypto from 'crypto';

/**
 * Enterprise Cryptography Utility
 * 
 * Provides HMAC-SHA256 signing and verification for zero-trust communication.
 */

/**
 * Generates an HMAC-SHA256 signature for a given payload.
 * @param payload The stringified JSON or raw string to sign.
 * @param secret The shared secret key.
 * @returns The hex-encoded signature.
 */
export function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Verifies if a signature matches the payload.
 * @param payload The received payload.
 * @param signature The received signature to verify.
 * @param secret The shared secret key.
 * @returns Boolean indicating if the signature is valid.
 */
export function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  
  const expectedSignature = generateSignature(payload, secret);
  
  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (e) {
    return false;
  }
}
