import { string } from "yup";

export const nameField = string()
  .trim()
  .min(1, "Name cannot be empty")
  .max(60, "Name must have at most 60 characters");

export const emailField = string()
  .trim()
  .email("Invalid email")
  .max(60, "Email must have at most 60 characters");

export const telephoneField = (maxLength: number) =>
  string()
    .trim()
    .min(8, "Telephone must have at least 8 characters")
    .max(maxLength, `Telephone must have at most ${maxLength} characters`)
    .matches(/^[+()\d\s-]+$/, "Invalid telephone format");

export const passwordField = string()
  .min(8, "Password must have at least 8 characters")
  .test(
    "bcrypt-limit",
    "Password must have at most 72 bytes",
    (value) => value === undefined || Buffer.byteLength(value, "utf8") <= 72,
  );
