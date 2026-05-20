'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

const headerInfo = {
  title: 'Vehicle API Demo (Python Backend)',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/blob/main/src/app/python-vin-search/page.tsx',
  stack: ['Next.js', 'Python', 'FastAPI', 'Vehicle API'],
};

const PYTHON_API_URL = 'http://localhost:8000';

type VinResult = {
  make: string;
  model: string;
  year: string;
  body_class: string;
  engine_model: string;
  raw: Record<string, unknown>;
};

export default function VinSearch() {
  const [vin, setVin] = useState('');
  const [result, setResult] = useState<VinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = vin.trim();

    if (!trimmed) {
      setError('Please enter a VIN.');
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const response = await fetch(
        `${PYTHON_API_URL}/api/vin/${encodeURIComponent(trimmed)}`,
      );

      if (!response.ok) {
        setError('Failed to fetch car data.');
        return;
      }

      const data: VinResult = await response.json();
      setResult(data);
    } catch {
      setError('Something went wrong. Is the Python server running?');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Box sx={{ flexGrow: 1, mx: 2 }}>
      <PageHeader headerInfo={headerInfo} />
      <Grid container spacing={2}>
        <Grid size={7}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <h2>
              <b>VIN number</b>
            </h2>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="text"
                name="vin"
                placeholder="Enter VIN"
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
                value={vin}
                onChange={(e) => {
                  setVin(e.target.value);
                }}
              />
              <Button type="submit" disabled={isPending} variant="contained">
                {isPending ? 'Searching...' : 'Search VIN'}
              </Button>
            </Box>

            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Make"
                value={result?.make ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Model"
                value={result?.model ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Year"
                value={result?.year ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Body Class"
                value={result?.body_class ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Engine Model"
                value={result?.engine_model ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <Box component="details" sx={{ mt: 2 }}>
                <Typography
                  component="summary"
                  sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
                  Raw JSON
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    mt: 1,
                    whiteSpace: 'pre-wrap',
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    p: 1.5,
                    fontSize: '0.75rem',
                  }}>
                  {JSON.stringify(result?.raw, null, 2)}
                </Box>
              </Box>
            </Grid>
          </Paper>
        </Grid>
        <Grid size={5}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body1" component="p" sx={{ mb: 1 }}>
              <b>How to test this app?</b>
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 1 }}>
              1. Start the Python server:
            </Typography>
            <Box
              component="pre"
              sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, mb: 1 }}>
              uvicorn main:app --reload --port 8000
            </Box>
            <Typography variant="body1" component="p" sx={{ mb: 1 }}>
              2. Enter a VIN number below. Go to{' '}
              <Link
                href="https://www.randomvin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline">
                www.randomvin.com
              </Link>{' '}
              to generate one.
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 1 }}>
              <b>Example VIN:</b>
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li>1G1ZT53836F127904</li>
              <li>2G4WC582981154304</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
