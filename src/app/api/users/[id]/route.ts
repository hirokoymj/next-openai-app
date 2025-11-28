import { supabase } from '../../../../lib/supabaseClient';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('GET /users/:id error:', error);
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { firstName, lastName, gender, email, city } = body;

    const { data, error } = await supabase
      .from('users')
      .update({ firstName, lastName, gender, email, city })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('PUT /users/:id error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update user' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('PUT /users/:id exception:', err);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ unwrap the promise
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
      status: 400,
    });
  }

  const { error } = await supabase.from('users').delete().eq('id', numericId);

  if (error) {
    console.error('Supabase DELETE error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
