import fs from 'fs';
import { getFileName } from '../../utils/getFileName.js';

export async function downloadAudio(url: string, messageId: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Download failed');

  const buffer = Buffer.from(await res.arrayBuffer());

  const filePath = getFileName(messageId);

  await fs.promises.mkdir('./audio', { recursive: true });
  await fs.promises.writeFile(filePath, buffer);

  return filePath;
}
