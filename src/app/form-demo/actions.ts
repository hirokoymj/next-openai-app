'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type FormState = {
  errors?: {
    firstName?: string;
    lastName?: string;
    gender?: string;
    email?: string;
    city?: string;
  };
  success?: boolean;
};

export async function createUser(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const firstName = formData.get('firstName')?.toString();
  const lastName = formData.get('lastName')?.toString();
  const gender = formData.get('gender')?.toString();
  const email = formData.get('email')?.toString();
  const city = formData.get('city')?.toString();

  const errors: FormState['errors'] = {};

  if (!firstName) errors.firstName = 'First name is required';
  if (!lastName) errors.lastName = 'Last name is required';
  if (!gender) errors.gender = 'Gender is required';
  if (!email) errors.email = 'Email is required';
  if (!city) errors.city = 'City is required';

  // ❌ Validation failed → return errors
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  if (!firstName || !lastName || !gender || !email || !city) {
    return { errors };
  }

  // ✅ Validation passed → DB write
  await db.user.create({
    firstName,
    lastName,
    gender,
    email,
    city,
  });

  revalidatePath('/form-demo');

  return { success: true };
}

export async function getUsers() {
  return await db.user.getAll();
}
