import { db } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
      status: 400,
    });
  }

  try {
    const user = await db.user.getById(numericId);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    console.error('GET /users/:id error:', error);
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
      status: 400,
    });
  }

  try {
    const body = await req.json();
    const updatedUser = await db.user.update(numericId, body);
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error: any) {
    console.error('PUT /users/:id error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update user' }), {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
      status: 400,
    });
  }

  try {
    await db.user.delete(numericId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('DELETE /users/:id error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
    });
  }
}
