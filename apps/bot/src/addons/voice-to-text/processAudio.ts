import { downloadAudio } from './downloadAudio.js';
import { summarize } from './summarize.js';
import { transcribe } from './transcribe.js';

export async function processAudio(url: string): Promise<string> {
  const filePath = './temp.ogg';

  await downloadAudio(url, filePath);

  const transcript = await transcribe(filePath);
  const summary = await summarize(transcript);

  return summary;
}
