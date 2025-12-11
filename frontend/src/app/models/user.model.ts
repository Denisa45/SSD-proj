// src/app/models/user.model.ts
export interface User {
  name?: string;         // optional because Firebase Auth doesn’t require it
  email: string;
  password: string;
}
