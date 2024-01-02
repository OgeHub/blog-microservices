import crypto from "crypto";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import User from "./user.interface";

const UserSchema = new Schema(
  {
    userID: {
      type: Number,
      required: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    emailVerificationToken: String,
    verificationTokenExpires: Date,
    passwordResetToken: String,
    passwordTokenExpires: Date
  },
  { timestamps: true }
);

UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | Boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.getEmailVerificationToken = function (): string {
  /**Generate token */
  const verificationToken = crypto.randomBytes(20).toString("hex");

  /**Hash token  and save it*/
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  /**Set expiration date for token*/
  this.verificationTokenExpires = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

UserSchema.methods.getPasswordResetToken = function (): string {
  /**Generate token */
  const resetToken = crypto.randomBytes(20).toString("hex");

  /**Hash token and save it */
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  /**Set expiration date for token */
  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default model<User>("User", UserSchema);
