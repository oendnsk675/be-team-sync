import { randomBytes } from 'crypto';

export async function encryptGCKWithPublicKey(
  gck: Buffer,
  publicKeyPem: string,
): Promise<string> {
  // PEM → CryptoKey
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = publicKeyPem
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '');

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'spki',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt'],
  );

  // Encrypt raw 32-byte Buffer (not a base64 string!)
  const gckArrayBuffer = gck.buffer.slice(
    gck.byteOffset,
    gck.byteOffset + gck.byteLength,
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    gckArrayBuffer,
  );

  return Buffer.from(encrypted).toString('base64');
}

/**
 * Generate Global Chat Key (GCK) - 256-bit AES key encoded in base64
 */
export function generateGCK(): Buffer {
  return randomBytes(32); // base64-encoded GCK
}
