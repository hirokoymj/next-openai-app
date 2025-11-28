import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, gender, email, city } = body;

    const { data, error } = await supabase
      .from('users')
      .insert([{ firstName, lastName, gender, email, city }])
      .select()
      .single();

    if (error) {
      console.error('POST /users error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create user' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (err) {
    console.error('POST /users exception:', err);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
    });
  }
}
