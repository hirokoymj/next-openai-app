import TodoListClient from './components/TodoListClient';
import Link from 'next/link';

export default async function TodoListPage() {
  const res = await fetch('http://localhost:3000/api/todos', {
    cache: 'no-store',
  });
  const todos = await res.json();
  console.log('Todos from API:', todos); // ✅ debug
  console.log(process.env.DB_USER);
  console.log(process.env.OPENAI_API_KEY);

  return (
    <main className="p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
        <Link
          href="/todos/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          ➕ Add New Todo
        </Link>
      </div>

      <TodoListClient todos={todos} />
    </main>
  );
}
