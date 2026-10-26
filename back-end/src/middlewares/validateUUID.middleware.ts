import { Request, Response, NextFunction } from "express";
import { validate as isUUID } from "uuid";

export const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;

  if (!id || !isUUID(id)) {
    res.status(400).json({
      message: "Invalid UUID",
    });
    return;
  }

  next();
};
