import { object, string } from "yup";
import { emailField } from "./fields.schema";

export const clientLoginValidator = object({
  email: emailField.required("Email is required"),
  password: string().required("Password is required"),
})
  .noUnknown(true, "Invalid login fields")
  .strict(true)
  .required();
