import jwt from "jsonwebtoken";
import User from "../user/user.interface";
import Token from "./interfaces/token.interface";

export const createToken = (user: User): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: process.env.JWT_EXPIRE_AT
  });
};

export const verifyToken = async (
  token: string
): Promise<jwt.VerifyErrors | Token> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payLoad) => {
      if (err) reject(err);

      resolve(payLoad as Token);
    });
  });
};

export default { createToken, verifyToken };
