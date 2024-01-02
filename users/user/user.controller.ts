import { Router, Request, Response, NextFunction } from "express";
import Controller from "../utils/interfaces/controller.interface";
import HttpException from "../utils/exceptions/http.exception";
import validationMiddleware from "../middlewares/validation.middleware";
import validate from "./user.validation";
import UserService from "./user.service";
import authenticated from "../middlewares/authenticated.middleware";
import { generateUserID } from "../utils/random";
import {
  sendEmailVerificationLink,
  sendPasswordResetLink
} from "../utils/email";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRouter();
  }

  /** Initialize all user endpoints */
  private initializeRouter(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );

    this.router.patch(`${this.path}/verify_email/:token`, this.verifyEmail);

    this.router.post(
      `${this.path}/login_with_email`,
      validationMiddleware(validate.loginWithEmail),
      this.loginWithEmail
    );

    this.router.post(
      `${this.path}/login_with_username`,
      validationMiddleware(validate.loginWithUsername),
      this.loginWithUsername
    );

    this.router.patch(`${this.path}/forgot_password`, this.forgotPassword);

    this.router.patch(`${this.path}/reset_password/:token`, this.resetPassword);

    this.router.get(`${this.path}/:id`, authenticated, this.getUser);

    this.router.patch(
      `${this.path}`,
      authenticated,
      validationMiddleware(validate.edit),
      this.editUser
    );

    this.router.get(`${this.path}`, authenticated, this.getUsers);
  }

  /** User Controllers */

  /**Register user */
  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, name, email, password } = req.body;
      const userID = generateUserID();
      const token = await this.UserService.register(
        userID,
        username,
        name,
        email,
        password,
        "user"
      );

      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/api/users/verifyEmail/${token}`;

      /**Send verification link */
      const mailOptions = {
        email,
        link: verificationLink,
        username
      };

      await sendEmailVerificationLink(mailOptions);

      res.status(201).json({
        status: "success",
        message: "User registered successfully"
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**Verify Email */
  private verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const token = req.params.token;
      const message = await this.UserService.verifyEmail(token);
      res.status(200).json({
        status: "success",
        message
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**Login with email */
  private loginWithEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const accessToken = await this.UserService.loginWithEmail(
        email,
        password
      );
      res.status(200).json({
        status: "success",
        message: "Login successfully",
        data: { accessToken }
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**Login with username */
  private loginWithUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, password } = req.body;
      const accessToken = await this.UserService.loginWithUsername(
        username,
        password
      );
      res.status(200).json({
        status: "success",
        message: "Login successfully",
        data: { accessToken }
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**Forgot password */
  private forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const token = await this.UserService.forgotPassword(req.body.email);

      const passwordResetLink = `${req.protocol}://${req.get(
        "host"
      )}/api/users/resetPassword/${token}`;

      const mailOptions = {
        email: req.body.email,
        link: passwordResetLink
      };

      await sendPasswordResetLink(mailOptions);

      res.status(200).json({
        status: "success",
        message: "Password reset link sent successfully"
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**Reset Password */
  private resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const message = await this.UserService.resetPassword(
        req.params.token,
        req.body.password
      );
      res.status(200).json({
        status: "success",
        message
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**Get a user details */
  private getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;
      const user = await this.UserService.getUser(id);

      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user
      });
    } catch (error: any) {
      next(new HttpException(404, error.message));
    }
  };

  /**Get all users */
  private getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const users = await this.UserService.getAllUsers();
      res.status(200).json({
        status: "success",
        message: "Users retrieved successfully",
        data: users
      });
    } catch (error: any) {
      next(new HttpException(404, error.message));
    }
  };

  /**Edit user details */
  private editUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userID = req.user.userID;

      const { name, username } = req.body;
      const user = await this.UserService.editUser(userID, {
        name,
        username
      });

      res.status(200).json({
        status: "success",
        message: "User details edited successfully",
        data: user
      });
    } catch (error: any) {
      next(new HttpException(404, error.message));
    }
  };
}

export default UserController;
