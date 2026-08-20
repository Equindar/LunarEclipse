import OpenAI from 'openai';
import configuration from '../../config';

const openai = new OpenAI({
  apiKey: configuration.integrations.openai.key,
});

export async function summarize(text: string) {
  const response = await openai.responses.create({
    model: 'gpt-4.1',
    input: `
Du bist ein Bug-Report-Analyzer.

Fasse folgende Sprachnachricht strukturiert zusammen:

Text:
${text}

Output-Format:
- Problem:
- Schritte zur Reproduktion:
- Erwartetes Verhalten:
- Tatsächliches Verhalten:
- Zusatzinfos:
`,
  });

  return response.output[0].content[0].text;
}
