import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import UserModel from "../user/user.model";
import Token from "../utils/interfaces/token.interface";
import HttpException from "../utils/exceptions/http.exception";
import jwt from "jsonwebtoken";

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorized"));
  }

  const accessToken = bearer?.split("Bearer ")[1].trim();

  try {
    const payLoad: Token | jwt.JsonWebTokenError = await verifyToken(
      accessToken
    );
    if (payLoad instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Token expired, login to get access"));
    }

    const user = await UserModel.findById(payLoad.id)
      .select("-password")
      .exec();
    if (!user) {
      return next(new HttpException(401, "User not found"));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorized"));
  }
}

export default authenticatedMiddleware;
