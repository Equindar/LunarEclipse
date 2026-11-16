import {
    Argon2PasswordHasher
} from '@lunareclipse/crypto';

export const passwordHasher = new Argon2PasswordHasher();

// export const tokenService = new JSONWebTokenService(
//   {
//   accessSecret: configuration.auth.accessSecret,
//   refreshSecret: configuration.auth.refreshSecret,
//   algorithm: configuration.auth.algorithm,
// }
// );
