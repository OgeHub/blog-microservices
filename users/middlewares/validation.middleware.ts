import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

function validationMiddleware(schema: Joi.Schema): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      skipUnknown: true
    };

    try {
      const value = await schema.validateAsync(req.body, validationOptions);
      req.body = value;
      next();
    } catch (err: any) {
      const errors: string[] = [];
      err.details.forEach((error: Joi.ValidationError) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors });
    }
  };
}

export default validationMiddleware;
