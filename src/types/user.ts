export interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  city: string;
}

export type NewUser = Omit<User, 'id'>;
