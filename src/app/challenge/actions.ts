'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { User, FormState } from './types';

const DATA_PATH = path.join(process.cwd(), 'data.json');

async function readDb(): Promise<User[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' },
    ];
  }
}
async function writeDb(users: User[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));
}
//===START: CRUD logic
export async function getUsers() {
  return await readDb();
}

export async function submitUser(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();

    if (!firstName || !lastName)
      return { success: false, message: 'Required.' };

    const users: User[] = await readDb();
    users.push({ id: Date.now(), firstName, lastName });

    await writeDb(users);
  } catch (e) {
    return { success: false, message: 'Failed to save' };
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

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const users: User[] = await readDb();
    return users.find((u) => u.id === userId) || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function editUser(prevState: any, formData: FormData) {
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
