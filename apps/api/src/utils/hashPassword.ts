import { argon2Sync, randomBytes } from 'node:crypto';

export async function hashPassword(password: string): Promise<string> {
  // --- Init
  const salt = randomBytes(16).toString('hex');
  const hash = await argon2Async(password, salt);
  return `${salt}:${hash}`;
}

async function argon2Async(password: string, salt: string): Promise<string> {
  // --- Init
  const memory = 19456;     // 19 MiB in KiB
  const passes = 2;         // 2 Iterationen
  const parallelism = 1;    // 1 Thread

  return new Promise<Buffer<ArrayBufferLike>>((resolve, reject) => {
    argon2Sync('argon2id', {
      // Parameter nach OWASP-Empfehlungen
      message: password,
      nonce: salt,
      memory,
      passes,
      parallelism,
      tagLength: 32  // 256-Bit Schlüssel
    })
    .then((hash) => resolve(hash.toString('hex')))
    .catch((error) => reject(error));
  }
}
