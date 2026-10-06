import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { accounts, users } from '../drizzle/schema/_index.js';
import { createDatabaseConnection, Database } from './index.js';
import { bufferToUuid } from './utils/uuid.js';

const db: Database = createDatabaseConnection();
try {

  const [newAccount] = await db.insert(accounts).values({}).$returningId();

  if (!newAccount) {
    throw new Error('Failed to insert new account.');
  }

  const [newUser] = await db.insert(users).values({
    accountId: newAccount.id,
    email: 'test4@test.de',
    emailVerified: 0,
    displayName: 'Test User 4',
    isActive: 1
  }).$returningId();

  if (!newUser) {
    throw new Error('Failed to insert new user.');
  }

  await new Promise(f => setTimeout(f, 2000));

  await db.update(accounts).set({ owner: newUser.id }).where(eq(accounts.id, newAccount.id));
  console.log(`Updated account ${newAccount.id} with owner ${newUser.id}`);

  await new Promise(f => setTimeout(f, 2000));

  const result = await db.select().from(users).where(eq(users.accountId, newAccount.id));
  console.log({
    ...result[0],
    uuid2: bufferToUuid(result[0]!.uuid),
  });

  const result2 = await db.select().from(accounts).where(eq(accounts.id, newAccount.id));
  console.log({
    ...result2[0],
    uuid2: bufferToUuid(result2[0]!.uuid),
  });


} catch (error) {
  console.error('Error occurred:', error);
}
