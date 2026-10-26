import { QueryFailedError } from "typeorm";
import { AppError } from "../errors/appError";

export const handleUniqueViolation = (error: unknown): never => {
  if (error instanceof QueryFailedError) {
    const driverError = error.driverError as {
      code?: string;
    };

    // PostgreSQL: violação de restrição UNIQUE.
    if (driverError.code === "23505") {
      throw new AppError("Email already exists", 409);
    }
  }

  throw error;
};
