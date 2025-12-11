// backend/src/auth/interfaces/auth-request.interface.ts

// This line is a safe, non-functional statement that forces the file 
// to be interpreted as an ES Module, bypassing the namespace warning.
// You must include the line break for clarity.
const x = 0;
x;

// Define the exact shape of your JWT payload (this is fine)
export interface JwtPayload {
  sub: number; // The user ID
  username: string;
}

// Extend the Express Request object globally (This is necessary)
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload; // Now req.user is correctly typed
    }
  }
}

// Export the AuthRequest type (this is also fine)
export interface AuthRequest extends Request {
    user: JwtPayload;
}