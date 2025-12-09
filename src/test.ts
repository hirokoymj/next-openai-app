import { VertexAI } from '@google-cloud/vertexai';

/**
 * TODO(developer): Update these variables before running the sample.
 */
async function analyze_pdf(projectId = 'hiroko-web') {
  const vertexAI = new VertexAI({
    project: projectId,
    location: 'us-central1',
  });

  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
  });

  const filePart = {
    fileData: {
      fileUri: 'gs://hiroko-web-pdf/IAM.pdf',
      mimeType: 'application/pdf',
    },
  };
  const textPart = {
    text: `
    You are a very professional document summarization specialist.
    Please summarize the given document.`,
  };

  const request = {
    contents: [{ role: 'user', parts: [filePart, textPart] }],
  };

  const resp = await generativeModel.generateContent(request);
  const contentResponse = await resp.response;
  console.log(JSON.stringify(contentResponse));
}

analyze_pdf();
