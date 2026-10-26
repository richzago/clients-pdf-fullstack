import { object, string } from "yup";
import {
  nameField,
  emailField,
  telephoneField,
  passwordField,
} from "./fields.schema";

export const updateClientValidator = object({
  name: nameField,
  email: emailField,
  telephone: telephoneField(20),
  password: passwordField,
  currentPassword: string().min(1, "Current password cannot be empty"),
})
  .noUnknown(true, "Invalid fields for client update")
  .strict(true)
  .required()
  .test(
    "at-least-one-field",
    "No fields provided for update",
    (value) => !!value && Object.keys(value).length > 0,
  )
  .test(
    "password-pair",
    "Password and currentPassword must be provided together",
    (value) => {
      if (!value) return true;

      const hasPassword = value.password !== undefined;
      const hasCurrentPassword = value.currentPassword !== undefined;

      return hasPassword === hasCurrentPassword;
    },
  );
