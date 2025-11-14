'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoListClient({ todos }: { todos: Todo[] }) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  async function handleUpdate(
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) {
    e.preventDefault();
    const completed = e.target.checked;
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">ID</th>
            <th className="px-4 py-2 text-left text-gray-600">Title</th>
            <th className="px-4 py-2 text-left text-gray-600">Completed</th>
            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr
              key={todo.id}
              className="border-t border-gray-200 hover:bg-gray-50 transition">
              <td className="px-4 py-2">{todo.id}</td>
              <td className="px-4 py-2">
                {todo.completed ? (
                  <s className="text-gray-400">{todo.title}</s>
                ) : (
                  <span>{todo.title}</span>
                )}
              </td>
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => handleUpdate(e, todo.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
              <td className="px-4 py-2 space-x-2">
                <Link
                  href={`/todos/${todo.id}/edit`}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
                  ✏️ Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(todo.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
