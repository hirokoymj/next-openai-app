'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { validateField } from '@/utils/formValidation';
import { NewUser } from '@/types';

export default function NewUserPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    city: '',
  });

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: async (user: NewUser) => {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, gender, email, city }),
      });
    },
    onSuccess: () => {
      router.push('/users');
    },
    onError: (error) => {
      console.error('Deletion failed:', error);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = {
      firstName: validateField('First Name', firstName),
      lastName: validateField('Last Name', lastName),
      email: validateField('Email', email),
      gender: validateField('Gender', gender),
      city: validateField('City', city),
    };

    setErrors(newErrors);

    // Prevent submit if validation fails
    if (Object.values(newErrors).some((msg) => msg !== '')) return;
    mutate({ firstName, lastName, gender, email, city });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                firstName: validateField('First Name', firstName),
              }))
            }
            placeholder="First Name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                lastName: validateField('Last Name', lastName),
              }))
            }
            placeholder="Last Name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                email: validateField('Email', email),
              }))
            }
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">Gender:</span>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={(e) => setGender(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  gender: validateField('Gender', gender),
                }))
              }
              className="w-4 h-4 text-blue-600"
            />
            <span>Male</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={(e) => setGender(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span>Female</span>
          </label>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                city: validateField('City', city),
              }))
            }
            placeholder="City"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 rounded text-white ${
              isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition`}>
            {isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/users')}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
