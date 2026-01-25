'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

let users = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith' },
];

export async function getUsers() {
  return users;
}

export async function deleteUser(userId: number) {
  users = users.filter((u) => u.id !== userId);
  revalidatePath('/challenge');
}

export async function getUserById(id: number) {
  return users.find((u) => u.id === id);
}

export async function editUser(prevState: any, formData: FormData) {
  const id = Number(formData.get('id'));
  const firstName = formData.get('firstName')?.toString();
  const lastName = formData.get('lastName')?.toString();

  if (!firstName || !lastName) {
    return { success: false, message: 'Names are required' };
  }
  const updated = users.map((user) =>
    user.id === id ? { id, firstName, lastName } : user,
  );
  users = updated;
  revalidatePath('/registration');
}

export async function submitUserForm(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName')?.toString();
  const lastName = formData.get('lastName')?.toString();

  if (!firstName || !lastName) {
    return { success: false, message: 'Both fields are required!' };
  }

  users.push({ id: Date.now(), firstName, lastName });

  revalidatePath('/registration'); // Refresh the list before we go back
  redirect('/registration'); // Go back to the user list
}
