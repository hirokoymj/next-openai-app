'use client';

import { useActionState, useState, FocusEvent } from 'react';
import { submitRecipe, type RecipeState } from './actions';
import {
  Grid,
  Paper,
  Container,
  Button,
  TextField,
  Alert,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { AiModelHeader } from '@/components/AiModelHeader';

export default function RecipePage() {
  const [state, formAction, isPending] = useActionState<RecipeState, FormData>(
    submitRecipe,
    null,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.trim();

    if (value === '') {
      setFieldError('Recipe name is required');
    } else {
      setFieldError(null);
    }
  };

  const handleChange = () => {
    if (fieldError) setFieldError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <RecipePageHeader />
        {/* INPUT SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Input
          </Typography>
          <Paper
            sx={{
              boxShadow: 'none',
              border: '1px solid #e0e0e0',
              padding: 2,
              minHeight: '200px',
            }}>
            <form action={formAction}>
              <TextField
                fullWidth
                name="recipe"
                label="Recipe"
                placeholder="e.g.Chocolate Chip Cookies"
                variant="outlined"
                disabled={isPending}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!fieldError}
                helperText={fieldError}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isPending || !!fieldError}
                startIcon={
                  isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }>
                {isPending ? 'Generating...' : 'Generate Recipe'}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* OUTPUT SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Output by Gemini
          </Typography>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              boxShadow: 'none',
              border: '1px solid #e0e0e0',
              backgroundColor: '#e8f5e9', // Sets the background to light green (e.g., green[50])
              padding: 2,
              minHeight: '200px',
            }}>
            {state?.success === false && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {state.message || 'Something went wrong.'}
              </Alert>
            )}

            {isPending && !state && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            )}

            {state?.success === true && (
              <>
                <Typography variant="h4" color="primary" gutterBottom>
                  {state.data.recipeName}
                </Typography>

                <Typography variant="h6" sx={{ mt: 3 }}>
                  Ingredients
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {state.data.ingredients?.map((item: string, i: number) => (
                    <Typography component="li" key={i} sx={{ mb: 0.5 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>

                <Typography variant="h6" sx={{ mt: 3 }}>
                  Steps
                </Typography>
                <Box component="ol" sx={{ pl: 2 }}>
                  {state.data.steps?.map((step: string, i: number) => (
                    <Typography component="li" key={i} sx={{ mb: 1.5 }}>
                      {step}
                    </Typography>
                  ))}
                </Box>
              </>
            )}

            {!isPending && state?.success === false && (
              <Typography color="text.secondary" align="center" sx={{ mt: 5 }}>
                Enter a dish name and click generate to see the magic.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

const headerInfo = {
  title: 'Recipe generator by Gemini',
  provider: 'Google',
  model: 'Gemini 2.5 Flash-Lite',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/tree/main/src/app/ai/recipe',
  referenceUrl:
    'https://ai.google.dev/gemini-api/docs/structured-output?example=recipe',
  referenceLabel: 'Structured outputs (JSON)',
  stack: [
    'Next.js',
    'Server Actions',
    'Gemini API (generateContent)',
    'Structure outputs',
    'Schema by Zod',
    'useActionState',
  ],
};
const RecipePageHeader = () => {
  return <AiModelHeader headerInfo={headerInfo} />;
};
