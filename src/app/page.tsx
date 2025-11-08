'use client';

import { action, getDropdownOptions } from './actions';
import { useActionState, useEffect, useState } from 'react';

const initialState = {
  success: false,
  message: '',
  gender: 'male', // default value stored in state
};

//For forms posting to a server action, we want uncontrolled inputs, using defaultChecked instead of checked.
export default function Home() {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={1} />
      <input
        type="text"
        name="username"
        style={{ border: '1px solid green' }}
      />
      <label>Gender*</label>
      <input
        type="radio"
        name="gender"
        value="male"
        defaultChecked={state.gender === 'male'}
      />{' '}
      Male
      <input
        type="radio"
        name="gender"
        value="female"
        defaultChecked={state.gender === 'male'}
      />
      Female
      <button type="submit" style={{ border: '1px solid red' }}>
        {isPending ? 'Submitting' : 'Submit'}
      </button>
      {state?.message && (
        <p className={state.success ? 'text-green-500' : 'text-red-500'}>
          {state.message}
        </p>
      )}
    </form>
  );
}

// import { action, getDropdownOptions } from './actions';
// import { useActionState, useEffect, useState } from 'react';
// const id = 1;
// interface Option {
//   id: number;
//   name: string;
// }
// export default function Home() {
//   const [state, formAction, isPending] = useActionState(action, undefined);
//   const [options, setOptions] = useState<Option[]>([]);

//   useEffect(() => {
//     async function fetchOptions() {
//       const data = await getDropdownOptions(); // call server action
//       setOptions(data);
//     }
//     fetchOptions();
//   }, []);

//   return (
//     <form action={formAction} className="flex flex-col gap-2">
//       <input type="hidden" name="id" value={id} />
//       <input
//         type="text"
//         name="username"
//         style={{ border: '1px solid green' }}
//       />
//       <select name="subject">
//         {options.map((option) => (
//           <option key={option.id}>{option.name}</option>
//         ))}
//       </select>
//       <label>Gender*</label>
//       <input
//         type="radio"
//         name="gender"
//         value="male"
//         checked={gender === 'male'}
//       />
//       Male
//       <input
//         type="radio"
//         name="gender"
//         value="female"
//         checked={gender === 'female'}
//       />
//       Female
//       <button type="submit" style={{ border: '1px solid red' }}>
//         {isPending ? 'Submitting' : 'Submit'}
//       </button>
//       {state?.message && (
//         <p className={state.success ? 'text-green-500' : 'text-red-500'}>
//           {state.message}
//         </p>
//       )}
//     </form>
//   );
// }
