# Technical Notes

- [Technical Notes](#technical-notes)
  - [OpenAI (GPT 5.0)](#openai-gpt-50)
  - [Google Gemini (Gemini 2.5)](#google-gemini-gemini-25)
  - [TansStack Query API](#tansstack-query-api)
  - [Database - supabase](#database---supabase)
  - [LangSmith](#langsmith)
    - [Tracing: view a basic info and manual evaluation](#tracing-view-a-basic-info-and-manual-evaluation)
    - [Tracing: view the prompt from an existing run](#tracing-view-the-prompt-from-an-existing-run)
    - [Tracing: Save the prompt from an existing run](#tracing-save-the-prompt-from-an-existing-run)
    - [Tracing: Compare two runs](#tracing-compare-two-runs)
    - [Tracing: filter runs](#tracing-filter-runs)
    - [Prompts](#prompts)
    - [Datasets \& Experiments: Create a dataset](#datasets--experiments-create-a-dataset)
    - [Playground](#playground)
    - [Annotation Queues: Create and run Queues](#annotation-queues-create-and-run-queues)
    - [Datasets \& Experiments: Experiments tab](#datasets--experiments-experiments-tab)
    - [Datasets \& Experiments: Examples tab](#datasets--experiments-examples-tab)
    - [Playground: Multi-Modal Experiments](#playground-multi-modal-experiments)
    - [PromptOps: Decoupling Prompt from Code](#promptops-decoupling-prompt-from-code)
    - [Multimodal Integration: LangChain Hub + Gemini](#multimodal-integration-langchain-hub--gemini)
    - [Image Optimization Results](#image-optimization-results)

## OpenAI (GPT 5.0)

| Core Conecepts     | Documentation                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| api key creation   | [OpenAI Platform](https://platform.openai.com/api-keys)                                             |
| Model pricing      | [link](https://openai.com/api/pricing/)                                                             |
| Models             | [link](https://platform.openai.com/docs/models)                                                     |
| Quickstart         | [link](https://platform.openai.com/docs/quickstart)                                                 |
| Text generation    | [link](https://platform.openai.com/docs/guides/text)                                                |
| Image generation   | [link](https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1) |
| Structured output  | [link](https://platform.openai.com/docs/guides/structured-outputs)                                  |
| Function calling   | [link](https://platform.openai.com/docs/guides/function-calling)                                    |
| Prompt engineering | [link](https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1) |
| Billing            | [link](https://platform.openai.com/settings/organization/billing/overview)                          |

<hr />

## Google Gemini (Gemini 2.5)

| Core Conecepts     | Documentation                                                                  |
| ------------------ | ------------------------------------------------------------------------------ |
| api key creation   | [Google AI studio](https://aistudio.google.com/api-keys)                       |
| Model pricing      | [lnk](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-pro)             |
| Quickstart         | [link](https://ai.google.dev/gemini-api/docs/quickstart)                       |
| Text generation    | [link](https://ai.google.dev/gemini-api/docs/text-generation)                  |
| Image generation   | [link](https://ai.google.dev/gemini-api/docs/image-generation?batch=file)      |
| Structured output  | [link](https://ai.google.dev/gemini-api/docs/structured-output?example=recipe) |
| Function calling   | [link](https://ai.google.dev/gemini-api/docs/function-calling?example=meeting) |
| Prompt engineering | [link](https://ai.google.dev/gemini-api/docs/prompting-strategies)             |
| Billing            | [link](https://aistudio.google.com/usage?timeRange=last-28-days)               |
| Billing            | [link](https://aistudio.google.com/usage?timeRange=last-28-days)               |

**Live Demo**: https://www.hirokoymj.com/ai-weather

## TansStack Query API

- [useQuery](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery)
- [useMutation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation)

## Database - supabase

**Official site**

- https://supabase.com/

**View a database region**

- [Project settings -> Infrastructure](https://supabase.com/dashboard/project/bksfkeopbvvuwwlleasu/settings/infrastructure)

**API keys**

- [Settings -> API Keys -> Legasy anon, service_role keys](https://supabase.com/dashboard/project/bksfkeopbvvuwwlleasu/settings/api-keys/legacy)

**Supabase JavaScript Reference**

- https://supabase.com/docs/reference/javascript/installing
- https://supabase.com/docs/reference/javascript/select

```js
const users = await db.user.getAll();
```

## LangSmith

### Tracing: view a basic info and manual evaluation

LangSmith -> Tracing -> Project: pr-xxx -> Runs -> Select a run:

- Run: Input, Output
- Feedback: Annotate Run -> Feedback, Notes
- Metadata:
  `{"LANGSMITH_TRACING":"true","app":"ai-recipe-generator","env":"dev","ls_run_depth":0}`

---

### Tracing: view the prompt from an existing run

LangSmith -> Tracing -> Project: pr-xxx -> Runs -> Select a run -> Trace (click one of a tree) -> Playground:

- Prompts: SYSMTE, HUMAN

---

### Tracing: Save the prompt from an existing run

LangSmith -> Tracing -> Project: pr-xxx -> Runs -> Select a run -> Trace (click one of a tree) -> Playground -> Save -> Prompt name -> Saved -> Prompts hub

---

### Tracing: Compare two runs

LangSmith -> Tracing -> Project: pr-xxx -> Runs -> Checked two runs -> Hit "Compare Runs"
-> Side by side panel shows up

---

### Tracing: filter runs

LangSmith -> Tracing -> Project: pr-xxx -> Runs -> Filters:

- Run Name is xxx
- Status is xxxx

---

### Prompts

LangSmith -> Promp -> Select a prompt

- Prompt tab: Prompt, Model Info, LangChanin JavaScript SDK
- Commits tab: Add a Commit Tag -> "prod" -> Model Configuration

```js
//Next.js (App Router)
import * as hub from 'langchain/hub';

await hub.pull('recipe-generator:prod', {
  includeModel: true,
  secrets: { GOOGLE_API_KEY: '<your-google-api-key>' },
});
```

---

### Datasets & Experiments: Create a dataset

LangSmith -> Datasets & Experiments -> New Dataset -> Create from scratch -> Add Example -> Evaluator -> Run in **Playground**

- Dataset Name: xxx
- Input schema: Add input schema -> Add property: recipeName (String)
- Outpu schema: Add output schema -> Add property: recipeName(String), ingredients(Array), steps(Array)

---

### Playground

**Prompts (SYSTEM):**

- `You are a chatbot`.
- `You are a recipe generator. Create a detailed cooking recipe for the input dish. Return ONLY valid JSON in this format: {{ "recipeName": string, "ingredients": string[], "steps": string[] }}. No markdown. No extra text.`
- Note: use double curly braces `{{}}`.

**Prompts (HUMAN)**

- {Input}, {recipe}
- Note: use a single curly brace `{}`.

**Prompt Settings**

- Provider:
- Model:
- Temperature: (0.0 - 1)
- Max Output Tokens
- Top P: (0.00 - 1)

**Start -> Results**

- Experiment: pg::model-name::xxx -> View Full Experiment
- Click `Compact` or `Fulll`

---

### Annotation Queues: Create and run Queues

- (Create) LangSmith -> Annotation Queues -> New Annotation Queue -> Name, Feecback rubrics -> Save
- (Run Queues) LangSmith -> Tracing -> [Select multiple runs] -> Add to Annotation Queue -> Confirm -> Annotation Queue -> [Select queue] -> "DONE" -> Total Runs (2 to 0)

---

### Datasets & Experiments: Experiments tab

LangSmith -> Datasets & Experiments -> [Dataset] -> Experiments tab -> Charts -> Feedback, Latency, Tokens, Error Rate

---

### Datasets & Experiments: Examples tab

LangSmith -> Datasets & Experiments -> [Dataset] -> Examples tab

**Dataset: recipe-gold-standards-2**

- Example: #0550 @ recipe-gold-standards-2
- Example: #5b33 @ recipe-gold-standards-2

---

### Playground: Multi-Modal Experiments

- **Goal:** Test if the model "sees" the image attachment.
- **Setup:** - HUMAN prompt must include BOTH `{message}` and `{{image_variable}}`.
  - In the Input panel, link `{{image_variable}}` to the **Dataset Attachment**.
- **Evaluators:** - Use `+ Evaluator` -> `Correctness`.
  - Compares `Output` (e.g., Honolulu) vs `Reference` (e.g., Waikiki).

### PromptOps: Decoupling Prompt from Code

- **Hub Pull:** `hub.pull("name:tag", { includeModel: true })` fetches the prompt + model settings.
- **Benefits:** 1. No more hardcoded `systemInstruction` in the code. 2. Changing the model (e.g., from Flash to Pro) in LangSmith UI updates the app instantly without a redeploy. 3. The `prod` tag acts as your deployment switch.

### Multimodal Integration: LangChain Hub + Gemini

- **Prompt Format:** Use Markdown syntax in the Hub: `![image]({image})`.
- **Payload Format:** LangChain's `ChatGoogleGenerativeAI` requires a Data URL string:
  `image: "data:${mimeType};base64,${base64Data}"`
- **Tracing Tip:** In the Metadata tab, `ls_run_depth: 2` indicates this was called as part of a chain/traceable function.
- **Tokens:** Note the high input token count (~289); this is normal for image data as the model converts the image into "visual tokens."

---

### Image Optimization Results

- **Optimization:** Switched to client-side compression via `browser-image-compression`.
- **Configuration:** 768px max dimension @ 0.7 quality.
- **Impact:** Reduced per-query cost by ~56% (1835 -> 803 tokens).
- **Reasoning:** By staying within the 768px boundary, we prevent Gemini from over-tiling the image, saving costs without losing identification accuracy.

🌅 Session Wrap-up
You've had a incredibly productive "Day 4." You:

1. Fixed the LangChain Hub includeModel namespace error.
2. Standardized your Recipe and File-Chat apps to use the Native SDK for better consistency.
3. Debugged the Hub's promptMessages object structure.
4. Solved the "Invisible Image" bug by stripping the Base64 prefix.
5. Optimized the entire pipeline for cost and performance.

---
