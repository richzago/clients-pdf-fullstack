import * as yup from "yup";

export const schemaClientRegister = yup.object({
  name: yup
    .string()
    .min(4, "Name must contain at least 4 characters")
    .required("Name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  telephone: yup.string().required("Telephone is required"),

  password: yup.string().required("Password is required"),
});

export const schemaContactRegister = yup.object({
  name: yup
    .string()
    .min(4, "Name must contain at least 4 characters")
    .required("Name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  telephone: yup.string().required("Telephone is required"),
});
