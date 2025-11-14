import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: body,
  });
  return NextResponse.json(user);
}

export async function DELETE(
  _,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.user.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Deleted' });
}

// import { NextResponse } from 'next/server';

// const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

// export async function GET(
//   request: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await context.params;

//   const res = await fetch(`${BASE_URL}/${id}`);
//   const data = await res.json();
//   return NextResponse.json(data);
// }

// export async function PUT(
//   request: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await context.params;
//   const body = await request.json();

//   const res = await fetch(`${BASE_URL}/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(body),
//     headers: { 'Content-Type': 'application/json' },
//   });

//   const data = await res.json();
//   return NextResponse.json(data);
// }

// export async function DELETE(
//   request: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await context.params;

//   await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
//   return NextResponse.json({ message: 'User deleted' });
// }
