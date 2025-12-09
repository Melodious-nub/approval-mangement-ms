export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional - only set when creating/updating user
  active: boolean;
}

