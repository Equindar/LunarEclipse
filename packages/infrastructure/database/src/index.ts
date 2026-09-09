// packages/infrastructure/database/src/index.ts
export { createDatabaseConnection, checkDatabaseConnection } from './client.js';
export type { Database } from './client.js';
export { createUserRepository } from './users/index.js';
