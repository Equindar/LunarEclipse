import {
    Argon2PasswordHasher,
    JwtTokenService,
} from '@lunareclipse/crypto';
import configuration from '../../config';

export const passwordHasher = new Argon2PasswordHasher();

export const tokenService = new JwtTokenService({
  accessSecret: configuration.auth.accessSecret,
  refreshSecret: configuration.auth.refreshSecret,
  algorithm: configuration.auth.algorithm,
});
