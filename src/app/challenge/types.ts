export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface FormState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}
