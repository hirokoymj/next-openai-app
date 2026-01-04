# AI Recipe generator

### Tech Stack

- Google Gemini 2.5 Flash-Lite
- Next.js (App Router)
- Streaming API
- Structured Output (JSON)
- Frontend: `POST (fetch), JSON body: {recipe}`
- Backend API: `/api/ai/recipe`
  - generateContentStream
  - Structured Output (JSON Schema)
  - Returns JSON: `{recipeName, ingredients[], steps[]}`

<hr />

### Architecture Overview

- UI page (`/ai/recipe`) renders progressively as data streams in.
- Backend API (`/api/ai/recipe`) streams Gemini output using JSON Schema.
- Structured output ensures predictable, type-safe responses.

<hr />

### Screenshot

![](../../../../public/screenshots/ai-gemini-recipe.png)

<hr />

### Code

I implemented a Next.js backend API that streams Gemini AI output with structured JSON, and a frontend that progressively renders recipes using React, Material UI, and Tailwind. The architecture ensures type-safe, predictable AI responses and a responsive user experience.

**Backend:**

```js
export async function POST(req: NextRequest) {
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipeName: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['recipeName', 'ingredients', 'steps'],
      },
    },
  });
  //for await (const chunk of stream) {}
  //const data = JSON.parse(fullText);
  //return NextResponse.json(data);
}
```

**Prompt**

```js
const prompt = `
	Create a detailed cooking recipe for: "${recipe}"
	Return only JSON with:
	- recipeName
	- ingredients (array of strings)
	- steps (array of strings)
`;
```

**Frontend**

```js
const response = await fetch('/api/ai/recipe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ recipe }),
});
//{...}
const recipe = recipeSchema.parse(JSON.parse(response.text));
```
