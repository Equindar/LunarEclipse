export { User } from './core/entities/User.js';
export { type Email, asEmail } from './core/value-objects/Email.js';
export { type UserID, asUserID } from './core/value-objects/UserID.js';
export type { UserRepository } from './core/repositories/UserRepository.js';
export type { CreateUserInput, CreateUserOutput, CreateUserUseCase } from './core/usecases/CreateUserUsecase.js';

export { CreateUser } from './application/logic/CreateUser.impl.js';

const idGenerator = new (await import('@lunareclipse/utilities')).Uuid7UserIDGenerator();

