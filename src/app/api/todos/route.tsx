import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prismaClient';

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const todoData = {
      title: body.title ?? 'Untitled',
      completed: typeof body.completed === 'boolean' ? body.completed : false,
    };

    const todo = await prisma.todo.create({ data: todoData });
    return NextResponse.json(todo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

// const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

// export async function GET() {
//   const res = await fetch(BASE_URL);
//   const data = await res.json();
//   return NextResponse.json(data);
// }
