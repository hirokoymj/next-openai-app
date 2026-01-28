# AI Recipe generator (Gemini)

**Backend**

- **Next.js 16 (App Router)**
- **Gemini API (Gemini 2.0 Flash-Lite):** `generateContent`.
- **Structured Outputs:** Leveraging `responseMimeType: 'application/json'` to ensure consistent data parsing.
- **Zod:** Defining the AI's response shape via JSON Schema.

**Frontend**

- **React `useActionState` Hook:** Managing form state, pending transitions, and server responses.
- **Material UI (MUI):**

---

### Folder Structure

```js
app/
  └── recipe/
      ├── actions.ts    # Server-side logic (Gemini API)
      ├── page.tsx      # Client-side UI (form handling)
      └── README.md
```

---

### The Input (Payload)

The application uses a standard `FormData` object submitted via a Next.js Server Action.

- **recipe**: The name of the dish the user wants to generate.

### The Output (Response State)

The state is managed by the `useActionState` hook and follows this structure:

- **success** (boolean): Indicates if the recipe was generated successfully.
- **data** (object): Contains recipeName, ingredients[], and steps[].
- **message** (string): (Optional) Error message or status update.

```js
type Recipe = {
  recipeName: string;
  ingredients: string[];
  steps: string[];
};

export type RecipeState =
  | { success: true; data: Recipe; message?: string }
  | { success: false; message: string; data?: Recipe }
  | null;
```

### Gemini API usage

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

### screenshot

![](../../../public/screenshots/gemini-recipe.png)

### Reference

- [Gemini API Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-output?example=recipe)
- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
