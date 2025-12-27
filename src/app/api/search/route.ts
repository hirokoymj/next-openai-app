import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query.' }, { status: 400 });
    }

    // Configure Vertex AI
    const projectId = 'hiroko-web'; // <-- update
    const location = 'us-central1';

    const vertexAI = new VertexAI({
      project: projectId,
      location,
    });

    const model = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    // PDF file from Cloud Storage
    const filePart = {
      fileData: {
        fileUri: 'gs://hiroko-web-pdf/IAM.pdf', // <-- update PDF
        mimeType: 'application/pdf',
      },
    };

    const textPart = {
      text: `
You are an expert PDF search assistant.
Your job is to find the most relevant information inside the provided PDF.

Instructions:
- Search the PDF for content that answers the user's question.
- Provide the answer in your own words.
- Include 1–3 quoted passages from the PDF that support the answer.
- Include page numbers if available.
- If the information is not found, respond with: "The document does not contain this information."

User Question: ${query}
      `,
    };

    const request = {
      contents: [{ role: 'user', parts: [filePart, textPart] }],
    };

    const resp = await model.generateContent(request);
    const contentResponse = await resp.response;

    return NextResponse.json({ data: contentResponse });
  } catch (err: any) {
    console.error('ERROR:', err);
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
