export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
}
export type Errors<T extends string> = {
  [K in T]: string;
};

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  city: string;
}

export type NewUser = Omit<User, 'id'>;
export type UpdatedUser = Omit<User, 'id'>;
