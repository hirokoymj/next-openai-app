'use client';

import { useActionState, useState } from 'react';
import { getCarInfo } from '../actions';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

const headerInfo = {
  title: 'Vehicle API Demo',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/blob/main/src/app/vin-search/page.tsx',
  stack: ['Next.js', 'Vehicle API', 'JSON', 'useActionState'],
};

const initialState = {
  data: null,
  error: null,
};

export default function VinSearch() {
  const [state, formAction, isPending] = useActionState(
    getCarInfo,
    initialState,
  );
  const [vin, setVin] = useState('');
  const result = state.data?.Results?.[0];

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
              action={formAction}
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

            {state.error && (
              <p className="mt-4 text-sm text-red-600">{state.error}</p>
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Make"
                value={result?.Make ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Model"
                value={result?.Model ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Year"
                value={result?.ModelYear ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Body Class"
                value={result?.BodyClass ?? ''}
                variant="filled"
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Engine Model"
                value={result?.EngineModel ?? ''}
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
                  {JSON.stringify(state.data, null, 2)}
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
              Go to{' '}
              <Link
                href="https://www.randomvin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline">
                www.randomvin.com
              </Link>{' '}
              and you can generate a vin number.
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
