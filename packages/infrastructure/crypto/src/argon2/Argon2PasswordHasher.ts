
import { PasswordHasher } from '@lunareclipse/features/auth';
import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';

type ParsedPasswordHash = {
  algorithm: 'argon2id';
  version: 'v1';
  salt: string;
  hash: string;
};

const ARGON2_OPTIONS = {
  memory: 19456,
  passes: 2,
  parallelism: 1,
  tagLength: 32,
};

const SALT_LENGTH = 16;
const HASH_LENGTH = 32;

export class Argon2PasswordHasher implements PasswordHasher {

  async hash(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH);

    const derivedKey = await this.derive(password, salt);

    return [
      'argon2id',
      'v1',
      salt.toString('hex'),
      derivedKey.toString('hex'),
    ].join('$');
  }

  async verify(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const parsed = this.parsePasswordHash(hashedPassword);

    if (parsed === null) {
      return false;
    }

    const salt = Buffer.from(parsed.salt, 'hex');
    const expectedHash = Buffer.from(parsed.hash, 'hex');

    const actualHash = await this.derive(password, salt);

    return timingSafeEqual(expectedHash, actualHash);
  }

  private parsePasswordHash(
  value: string,
): ParsedPasswordHash | null {
  const [algorithm, version, salt, hash] = value.split('$');

  if (
    algorithm !== 'argon2id' ||
    version !== 'v1' ||
    salt === undefined ||
    hash === undefined ||
    !/^[a-f0-9]{32}$/i.test(salt) ||
    !/^[a-f0-9]{64}$/i.test(hash)
  ) {
    return null;
  }

  return {
    algorithm,
    version,
    salt,
    hash,
  };
}

  private derive(
    password: string,
    salt: Buffer,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      argon2(
        'argon2id',
        {
          ...ARGON2_OPTIONS,
          message: password,
          nonce: salt,
        },
        (error, derivedKey) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(derivedKey);
        },
      );
    });
  }
}
