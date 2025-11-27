import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  return Response.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: body,
  });
  return Response.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // must await
    console.log('Deleting user with ID:', id);

    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });

    return Response.json({ message: 'Deleted', user });
  } catch (error: any) {
    console.error('DELETE error:', error);

    return Response.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}
