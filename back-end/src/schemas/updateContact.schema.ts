import { object } from "yup";
import { nameField, emailField, telephoneField } from "./fields.schema";

export const updateContactValidator = object({
  name: nameField,
  email: emailField,
  telephone: telephoneField(14),
})
  .noUnknown(true, "Invalid fields for contact update")
  .strict(true)
  .required()
  .test(
    "at-least-one-field",
    "No fields provided for update",
    (value) => !!value && Object.keys(value).length > 0,
  );
