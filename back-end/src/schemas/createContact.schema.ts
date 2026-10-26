import { object } from "yup";
import { nameField, emailField, telephoneField } from "./fields.schema";

export const createContactValidator = object({
  name: nameField.required("Name is required"),
  email: emailField.required("Email is required"),
  telephone: telephoneField(14).required("Telephone is required"),
})
  .noUnknown(true, "Invalid fields for contact creation")
  .strict(true)
  .required();
