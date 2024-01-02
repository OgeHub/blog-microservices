import { Document } from "mongoose";

interface User extends Document {
  userID: number;
  username: string;
  name: string;
  password: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  emailVerificationToken: any;
  verificationTokenExpires: any;
  passwordResetToken: any;
  passwordTokenExpires: any;

  isValidPassword(password: string): Promise<Error | Boolean>;
  getEmailVerificationToken(): string;
  getPasswordResetToken(): string;
}

export default User;
