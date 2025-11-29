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
  },
};
