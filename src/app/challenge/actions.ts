'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { readDb, writeDb } from './db';
import { User, UserActionState } from './types';

export async function getUsers(): Promise<User[]> {
  return await readDb();
}

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const users: User[] = await readDb();
    return users.find((u) => u.id === userId) || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function submitUser(
  prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  try {
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();

    if (!firstName || !lastName)
      return { success: false, message: 'First and Last names are required.' };

    const users: User[] = await readDb();
    users.push({ id: Date.now(), firstName, lastName });

    await writeDb(users);
  } catch (e) {
    return { success: false, message: 'Failed to save user to database.' };
  }

  revalidatePath('/challenge');
  redirect('/challenge');
}

export async function editUser(
  prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  try {
    const id = Number(formData.get('id'));
    const firstName = formData.get('firstName')?.toString() || '';
    const lastName = formData.get('lastName')?.toString() || '';

    const users: User[] = await readDb();

    const updated = users.map((user) =>
      user.id === id ? { id, firstName, lastName } : user,
    );
    await writeDb(updated);
  } catch (e) {
    console.error('Edit failed:', e);
    return { success: false, message: 'Could not update user.' };
  }
  revalidatePath('/challenge');
  redirect('/challenge');
}

export async function deleteUser(userId: number) {
  try {
    const users: User[] = await readDb();
    const updatedUsers = users.filter((u) => u.id !== userId);

    await writeDb(updatedUsers);
  } catch (e) {
    return { success: false, message: 'Failed to delete' };
  }

  revalidatePath('/challenge');
}
