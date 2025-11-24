import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import OpenAI from 'openai';
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

export default async function HelloPage() {
  const response = await client.responses.parse({
    model: 'gpt-4o-2024-08-06',
    input: [
      { role: 'system', content: 'Extract the event information.' },
      {
        role: 'user',
        content: 'Alice and Bob are going to a science fair tomorrow.',
      },
    ],
    text: {
      format: zodTextFormat(CalendarEvent, 'event'),
    },
  });

  const event = response.output_parsed;
  console.log(event);

  return (
    <div>
      <h1>Hello from Next.js!</h1>
    </div>
  );
}
