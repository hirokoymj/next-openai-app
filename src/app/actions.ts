'use server';

import data from './data';

const initialState = {
  success: false,
  firstName: '',
  lastName: '',
  food: '',
  gender: 'male',
  subjects: ['CS'],
};

export async function action(prevState: any, formData: FormData) {
  // Simulate a delay for submission
  await new Promise((resolve) => setTimeout(resolve, 500));

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const gender = formData.get('gender') as string;
  const food = formData.get('food') as string;
  const subjects = formData.getAll('subject') as string[];

  return {
    success: true,
    firstName,
    lastName,
    gender,
    food,
    subjects,
  };
}

export async function getDropdownOptions() {
  return data;
}

export async function getMessage() {
  return 'Hello from Server Action!';
}
