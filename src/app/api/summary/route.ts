import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();
    // Convert style to human-readable instructions
    let styleInstruction = '';
    switch (style) {
      case 'short':
        styleInstruction =
          'Summarize the text in one short paragraph, less than 300 characters.';
        break;
      case 'medium':
        styleInstruction =
          'Summarize the text in 2-3 sentences with moderate detail.';
        break;
      case 'bullet':
        styleInstruction =
          'Summarize the text in bullet points, each bullet being concise.';
        break;
      default:
        styleInstruction = 'Summarize the text in one short paragraph.';
    }
    const response = await openai.responses.create({
      model: 'gpt-5-nano',
      reasoning: { effort: 'low' },
      instructions: `${styleInstruction}\n\nText: ${prompt}`,
      input: prompt,
    });
    console.log(response);
    const reply = response.output_text || '';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
