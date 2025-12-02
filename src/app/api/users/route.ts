import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

//GET /api/users?page&limit
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
  const search = searchParams.get('search') || '';

  const { data, total } = await db.user.getPaginated(
    page,
    limit,
    sortBy,
    sortOrder,
    search
  );

  return NextResponse.json({
    users: data,
    total,
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newUser = await db.user.create(body);
  return NextResponse.json(newUser);
}
