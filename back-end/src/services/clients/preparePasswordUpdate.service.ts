
import { compare, hash } from "bcryptjs";
import { AppError } from "../../errors/appError";

const preparePasswordUpdate = async (
  currentPassword: string | undefined,
  newPassword: string,
  storedHash: string
): Promise<string> => {
  if (!currentPassword) {
    throw new AppError("Current password is required", 400);
  }

  const passwordMatches = await compare(
    currentPassword,
    storedHash
  );

  if (!passwordMatches) {
    throw new AppError("Current password is incorrect", 403);
  }

  return hash(newPassword, 10);
};

export default preparePasswordUpdate;
