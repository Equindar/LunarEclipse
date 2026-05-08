import { downloadAudio } from "./downloadAudio";
import { summarize } from "./summarize";
import { transcribe } from "./transcribe";

export async function processAudio(url: string): Promise<string> {
  const filePath = "./temp.ogg";

  await downloadAudio(url, filePath);

  const transcript = await transcribe(filePath);
  const summary = await summarize(transcript);

  return summary;
}
