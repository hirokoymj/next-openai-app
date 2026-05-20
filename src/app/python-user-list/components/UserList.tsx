'use client';

import React, { useState, useEffect } from 'react';

const PYTHON_API_URL = 'http://localhost:8000';

type UserResult = {
  id: number;
  name: string;
  username: string;
  email: string;
};

const UserList = () => {
  const [users, setUsers] = useState<UserResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      setUsers([]);

      try {
        const response = await fetch(`${PYTHON_API_URL}/api/users`);
        if (!response.ok) {
          setError('Failed to fetch users');
          return;
        }

        const data: UserResult[] = await response.json();
        setUsers(data);
      } catch {
        setError('Something went wrong. Is the Python server running?');
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User List by Python backend</h1>
      <p>Python backend API: http://localhost:8000/docs</p>
      <ul>
        {users.map(({ id, name, username, email }: UserResult) => (
          <li key={id}>
            {id}, {name}, {username}, {email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

// AI:
//setUsers(null) → setUsers([]) to match UserResult[] state type
//data: UserResult → data: UserResult[] to match the array returned by the API
//Map callback {} without return → () with implicit return, and added key={id}
