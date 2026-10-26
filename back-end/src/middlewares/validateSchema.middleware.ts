import { Request, Response, NextFunction } from "express";
import { AnySchema, ValidationError } from "yup";

const validateSchema = (schema: AnySchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          message: error.errors,
        });
        return;
      }

      next(error);
    }
  };
};

export default validateSchema;
