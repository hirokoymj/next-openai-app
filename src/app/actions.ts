'use server';

import data from './data';

export async function action(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const gender = formData.get('gender') as string;
  const id = formData.get('id') as string;
  return {
    success: true,
    message: `Updated user: ${username} (${gender})`,
    gender, // return this so UI stays selected after submit
  };
}

// export async function action(prevState: any, formData: FormData) {
//   //await new Promise((resolve) => setTimeout(resolve, 1000));

//   const username = formData.get('username') as string;
//   const id = formData.get('id') as string;
//   const subject = formData.get('subject') as string;

//   if (username.length < 3) {
//     return {
//       success: false,
//       message: 'Username must be at leaset 3 characters long',
//     };
//   }

//   return {
//     success: true,
//     message: `User ${id} updated to ${username}, ${subject}`,
//   };
// }

export async function getDropdownOptions() {
  return data;
}

export async function getMessage() {
  return 'Hello from Server Action!';
}
