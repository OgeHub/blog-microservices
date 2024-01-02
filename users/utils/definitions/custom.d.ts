import User from "../../user/user.interface";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
