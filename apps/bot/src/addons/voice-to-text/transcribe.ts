import fs from 'fs';
import OpenAI from 'openai';
import configuration from '../../config/index.js';

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
