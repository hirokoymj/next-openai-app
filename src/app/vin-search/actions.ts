'use server';

type VinState = {
  data: any | null;
  error: string | null;
};

const vinApiUrl = 'https://vpic.nhtsa.dot.gov/api';

export async function getCarInfo(
  prevState: VinState,
  formData: FormData,
): Promise<VinState> {
  const vin = String(formData.get('vin') || '').trim();

  if (!vin) {
    return { data: null, error: 'Please enter a VIN.' };
  }

  try {
    const response = await fetch(
      `${vinApiUrl}/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return { data: null, error: 'Failed to fetch car data.' };
    }

    const data = await response.json();

    return { data, error: null };
  } catch {
    return {
      data: null,
      error: 'Something went wrong while fetching VIN data.',
    };
  }
}
