'use client';

import { useState } from 'react';
import {
  Grid,
  Paper,
  Container,
  Button,
  TextField,
  Alert,
  Typography,
} from '@mui/material';

export default function RecipePage() {
  const [recipe, setRecipe] = useState('');
  const [recipeError, setRecipeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState('');

  const generateRecipe = async () => {
    setOutput(null);
    setError(null);
    setStreamText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe }),
      });

      if (!res.body) {
        throw new Error('Streaming not supported');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        setStreamText(fullText);
      }

      const parsed = JSON.parse(fullText);
      setOutput(parsed);
    } catch (err) {
      setError('Failed to generate recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* PAGE TITLE */}
        <Grid size={{ xs: 12 }}>
          <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5 mb-5">
            <h1 className="text-2xl font-bold text-center mb-3">
              AI Recipe generator by Gemini
            </h1>
          </div>
        </Grid>

        {/* MAIN CONTENT (INPUT + OUTPUT) */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={3}>
            {/* INPUT */}
            <Grid size={{ xs: 12, md: 6 }}>
              <b>Input</b>
              <Paper sx={{ p: 2, mb: 4 }}>
                <TextField
                  label="Recipe"
                  value={recipe}
                  fullWidth
                  required
                  error={!!recipeError}
                  helperText={recipeError}
                  onChange={(e) => {
                    setRecipe(e.target.value);
                    if (e.target.value.trim()) setRecipeError('');
                  }}
                  onBlur={() => {
                    if (!recipe.trim()) setRecipeError('Recipe is required.');
                  }}
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  fullWidth
                  onClick={generateRecipe}
                  disabled={!recipe || loading}>
                  {loading ? 'Generating...' : 'Generate Recipe'}
                </Button>
              </Paper>
            </Grid>

            {/* OUTPUT */}
            <Grid size={{ xs: 12, md: 6 }}>
              <b>Output by Gemini</b>
              <Paper sx={{ p: 2, minHeight: '100%' }}>
                {error && <Alert severity="error">{error}</Alert>}

                {loading && streamText && (
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{streamText}</pre>
                )}

                {!loading && output && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      {output.recipeName}
                    </Typography>

                    <Typography variant="h6" gutterBottom>
                      Ingredients
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {output.ingredients?.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <Typography variant="h6" gutterBottom>
                      Steps
                    </Typography>
                    <ol className="list-decimal list-inside space-y-1">
                      {output.steps?.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* TECH STACK CARD */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              height: '100%',
            }}>
            <Typography variant="h6" gutterBottom>
              Tech Stack
            </Typography>

            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Google Gemini 2.5 Flash-Lite</li>
              <li>Next.js (App Router)</li>
              <li>Streaming API</li>
              <li>Structured Output (JSON)</li>
              <li>Frontend: POST (fetch)</li>
              <li>
                Backend API: <b>/api/ai/recipe</b>
              </li>
              <li>
                <a
                  href="https://github.com/hirokoymj/next-openai-app/tree/main/src/app/ai/recipe"
                  target="_blank"
                  className="text-blue-700 font-medium hover:underline">
                  <b>GitHub</b>
                </a>
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
