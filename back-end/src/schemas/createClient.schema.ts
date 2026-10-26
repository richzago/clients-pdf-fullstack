import { object } from "yup";
import {
  nameField,
  emailField,
  telephoneField,
  passwordField,
} from "./fields.schema";

export const createClientValidator = object({
  name: nameField.required("Name is required"),
  email: emailField.required("Email is required"),
  telephone: telephoneField(20).required("Telephone is required"),
  password: passwordField.required("Password is required"),
})
  .noUnknown(true, "Invalid fields for client creation")
  .strict(true)
  .required();
