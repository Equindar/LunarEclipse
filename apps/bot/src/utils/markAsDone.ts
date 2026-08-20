import fs from 'fs';
import { getFileName } from './getFileName';

export async function markAsDone(messageId: string) {
  const oldPath = getFileName(messageId);
  const newPath = getFileName(messageId, true);

  await fs.promises.rename(oldPath, newPath);
}
