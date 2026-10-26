
import { object, string } from "yup";

export const updateClientValidator = object({
  name: string()
    .trim()
    .min(1)
    .max(60),

  email: string()
    .trim()
    .min(1)
    .email("Invalid email")
    .max(60),

  telephone: string()
    .min(8)
    .max(20),

  password: string()
    .min(8, "Password must have at least 8 characters")
    .test(
      "bcrypt-limit",
      "Password must have at most 72 bytes",
      (value) =>
        value === undefined ||
        (typeof value === "string" &&
          Buffer.byteLength(value, "utf8") <= 72)
    ),

  currentPassword: string()
    .min(1, "Current password cannot be empty"),
})
  .noUnknown(true, "Invalid fields for client update")
  .strict(true)
  .test(
    "at-least-one-field",
    "No fields provided for update",
    (value) => !!value && Object.keys(value).length > 0
  )
  .test(
    "password-pair",
    "Password and currentPassword must be provided together",
    (value) => {
      if (!value) return true;

      const hasPassword = value.password !== undefined;
      const hasCurrentPassword =
        value.currentPassword !== undefined;

      return hasPassword === hasCurrentPassword;
    }
  );
