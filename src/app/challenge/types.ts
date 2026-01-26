export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export type UserActionState =
  | {
      success: true;
      message?: string;
      errors?: never;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[]>; // Useful for Zod field errors
    }
  | null;
