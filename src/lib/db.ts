import { supabase } from './supabaseClient';

export const db = {
  user: {
    async getAll() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data;
    },
    async create(user: {
      firstName: string;
      lastName: string;
      gender: string;
      email: string;
      city: string;
    }) {
      const { data, error } = await supabase.from('users').insert([user]);
      if (error) throw error;
      return data;
    },
    async getById(id: number) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    async update(
      id: number,
      user: Partial<{
        firstName: string;
        lastName: string;
        gender: string;
        email: string;
        city: string;
      }>
    ) {
      const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    async delete(id: number) {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    async getPaginated(
      page: number,
      limit: number,
      sortBy: string,
      sortOrder: 'asc' | 'desc',
      search: string
    ) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply search (firstName OR lastName)
      if (search) {
        query = query.or(
          `firstName.ilike.%${search}%,lastName.ilike.%${search}%`
        );
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        data,
        total: count ?? 0,
      };
    },
  },
};

// async getPaginated(
//   page: number,
//   limit: number,
//   sortBy: string,
//   sortOrder: 'asc' | 'desc',
//   search: string
// ) {
//   const from = (page - 1) * limit;
//   const to = from + limit - 1;

//   const validColumns = ['firstName', 'lastName', 'email', 'city', 'id'];
//   const column = validColumns.includes(sortBy) ? sortBy : 'id';

//   const { data, error, count } = await supabase
//     .from('users')
//     .select('*', { count: 'exact' })
//     .order(column, { ascending: sortOrder === 'asc' })
//     .range(from, to);

//   if (error) throw error;

//   return {
//     data,
//     total: count ?? 0,
//   };
// },
