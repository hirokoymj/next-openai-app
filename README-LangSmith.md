# LangSmith

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

## 2/2

Tracing
Flow: Dataset(Example: inputs, ref outputs) -> Playground (TEST) -> Experiment Results(Chart) -> Save a Prompt -> Implement the prompt in the code (filechat-prompt:prod)

### References:

- https://docs.langchain.com/langsmith/alerts
- [How to Run Multi-Modal Experiments in LangSmith Playground](https://www.youtube.com/watch?v=-VOnEpk3uWo&t=7s)
