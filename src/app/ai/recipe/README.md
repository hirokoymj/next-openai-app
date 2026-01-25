# AI Recipe generator (Gemini)

### 🚀 Tech Stack & Architectures

**Backend (Server Side)**

- **Next.js 16 (App Router)**
- **Gemini API (Gemini 2.0 Flash-Lite):** `generateContent`.
- **Structured Outputs:** Leveraging `responseMimeType: 'application/json'` to ensure consistent data parsing.
- **Zod:** Defining the AI's response shape via JSON Schema.

**Frontend (Client Side)**

- **React `useActionState` Hook:** Managing form state, pending transitions, and server responses.
- **Material UI (MUI):**

---

## Folder Structure

```js
app/
    └── ai/
        └── recipe/
            ├── actions.ts    # Server-side logic (Gemini API, Zod validation)
            ├── page.tsx       # Client-side UI (MUI, form handling)
            └── README.md      # Technical documentation

```

---

## `useActionState` and RecipeState type

```ts
const [state, formAction, isPending] = useActionState<RecipeState, FormData>(
  submitRecipe,
  null,
);

type RecipeState =
  | {
      success: true;
      data: {
        recipeName: string;
        ingredients: string[];
        steps: string[];
      };
      message?: string;
    }
  | {
      success: false;
      message: string;
      data?: never;
    }
  | null;
```

## Gemni API usage

```ts
const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash-lite',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseJsonSchema: zodToJsonSchema(recipeSchema as any),
  },
});
```

## Reference

- [Gemini API Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-output?example=recipe)
- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
