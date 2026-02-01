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

### References:

- https://docs.langchain.com/langsmith/alerts
