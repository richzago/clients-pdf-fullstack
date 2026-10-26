
import { AppError } from "../errors/appError";

export const requireEntity = <T>(
  entity: T | null | undefined,
  message: string
): T => {
  if (entity == null) {
    throw new AppError(message, 404);
  }

  return entity;
};
