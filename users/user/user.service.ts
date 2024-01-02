import UserModel from "./user.model";
import token from "../utils/token";
import crypto from "crypto";

class UserService {
  public async register(
    userID: number,
    username: string,
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<String | Error> {
    try {
      /**Check if user exist */
      const user = await UserModel.findOne({ email });
      if (user) {
        throw Error("User already exist, login instead");
      }

      const newUser = new UserModel({
        userID,
        username,
        name,
        email,
        password,
        role
      });

      /**Generate email verification token*/
      const token = newUser.getEmailVerificationToken();

      await newUser.save();

      return token;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  public async verifyEmail(token: string): Promise<string | Error> {
    try {
      /**Hash token*/
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      /**Find user with the token */
      const user = await UserModel.findOne({
        emailVerificationToken: hashedToken,
        verificationTokenExpires: { $gt: Date.now() }
      });
      if (!user) {
        throw Error("Invalid or expired token");
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.verificationTokenExpires = undefined;

      await user.save();

      return "Email verified successfully";
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  public async loginWithEmail(
    email: string,
    password: string
  ): Promise<string | Error> {
    try {
      // Find User
      const user = await UserModel.findOne({ email });

      if (!user) throw Error("User not found");

      /**Check if email is verified*/
      if (user.isEmailVerified) {
        /**Check if password is correct*/
        if (await user.isValidPassword(password)) {
          return token.createToken(user);
        } else {
          throw Error("Invalid credentials");
        }
      } else {
        throw Error("Verify email to login");
      }
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  public async loginWithUsername(
    username: string,
    password: string
  ): Promise<string | Error> {
    try {
      // Find user
      const user = await UserModel.findOne({ username });
      if (!user) throw Error("User not found");

      /**Check if email is verified*/
      if (await user.isEmailVerified) {
        /**Check if password is correct*/
        if (await user.isValidPassword(password)) {
          return token.createToken(user);
        } else {
          throw Error("Invalid credentials");
        }
      } else {
        throw Error("Verify email to login");
      }
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  public async forgotPassword(email: string): Promise<string | Error> {
    try {
      /**Find user */
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw Error("There  is no user with this email");
      }

      /**Generate password reset token */
      const token = user.getPasswordResetToken();

      await user.save();

      return token;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  public async resetPassword(
    token: string,
    password: string
  ): Promise<string | Error> {
    try {
      /**Hash token */
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      /**Find user */
      const user = await UserModel.findOne({
        passwordResetToken: hashedToken,
        passwordTokenExpires: { $gt: Date.now() }
      });
      if (!user) {
        throw Error("Invalid or expired token");
      }

      /**Update password */
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordTokenExpires = undefined;
      await user.save();

      return "Password updated successfully";
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  public async getUser(id: string): Promise<object | null> {
    try {
      const user = await UserModel.findById(id, {
        password: 0,
        __v: 0,
        emailVerificationToken: 0,
        verificationTokenExpires: 0,
        passwordResetToken: 0,
        passwordTokenExpires: 0
      });

      return user;
    } catch (error) {
      throw Error("User not found");
    }
  }

  public async getAllUsers(): Promise<any> {
    try {
      const users = await UserModel.find(
        {},
        {
          password: 0,
          __v: 0,
          emailVerificationToken: 0,
          verificationTokenExpires: 0,
          passwordResetToken: 0,
          passwordTokenExpires: 0
        }
      ).sort({
        createdAt: -1
      });

      return users;
    } catch (error) {
      throw Error("Users not found");
    }
  }

  public async editUser(userID: number, data: object): Promise<any> {
    try {
      const user = await UserModel.findOneAndUpdate({ userID }, data, {
        new: true,
        runValidators: true,
        fields: {
          password: 0,
          __v: 0,
          emailVerificationToken: 0,
          verificationTokenExpires: 0,
          passwordResetToken: 0,
          passwordTokenExpires: 0
        }
      });

      return user;
    } catch (error) {
      throw Error("Unable to edit user details");
    }
  }
}

export default UserService;
