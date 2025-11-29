'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { User } from '@/recipe.ts/user';
import { validateField } from '@/utils/formValidation';

type UpdatedUser = Omit<User, 'id'>;

const fetchUser = async (id: string): Promise<User> => {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

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

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });

  const {
    mutate,
    data,
    isPending,
    isError: isMutationError,
  } = useMutation({
    mutationFn: async (user: UpdatedUser) => {
      await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
    },
    onSuccess: () => {
      router.push('/users');
    },
    onError: (error) => {
      console.error('Update failed:', error);
    },
  });

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setGender(userData.gender);
      setEmail(userData.email);
      setCity(userData.city);
    }
  }, [userData]);

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
    if (Object.values(newErrors).some((msg) => msg !== '')) return;

    mutate({ firstName, lastName, gender, email, city });
  }

  // Handle loading and error states for the data fetch
  if (isLoading || isPending) return <div>Loading user details...</div>;
  if (isError || isMutationError) return <div>Error loading user data.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit User</h1>
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
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  gender: validateField('Gender', gender),
                }))
              }
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
            {isPending ? 'Editing...' : 'Edit'}
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
