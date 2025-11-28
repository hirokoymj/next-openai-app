import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bksfkeopbvvuwwlleasu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) throw new Error('SUPABASE_KEY is not defined');

export const supabase = createClient(supabaseUrl, supabaseKey);
