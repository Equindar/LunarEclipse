import OpenAI from 'openai';
import fs from 'fs';
import configuration from '../../config.js';

const openai = new OpenAI({
  apiKey: configuration.integrations.openai.key,
});

export async function transcribe(filePath: string) {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: configuration.integrations.openai.model,
  });

  return response.text;
}
