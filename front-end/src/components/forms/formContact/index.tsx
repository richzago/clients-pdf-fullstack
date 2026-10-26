import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { InferType } from "yup";

import { AuthContext } from "../../../contexts/AuthContext";
import { schemaContactRegister } from "../../../validations/validationRegister";

import { Container, FormStyle } from "./style";

type ContactRegisterFormData = InferType<typeof schemaContactRegister>;

const FormContactRegister = () => {
  const { contactRegister } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactRegisterFormData>({
    resolver: yupResolver(schemaContactRegister),
  });

  const onSubmitFunction = (data: ContactRegisterFormData) => {
    contactRegister(data);
  };

  return (
    <Container>
      <FormStyle noValidate onSubmit={handleSubmit(onSubmitFunction)}>
        <h2>Register Contact</h2>

        <p className="subtitle">Add a new contact to your account.</p>

        <div className="field">
          <label htmlFor="contact-name">Full Name</label>

          <input
            id="contact-name"
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name")}
          />

          {errors.name && (
            <p id="contact-name-error" className="error" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="contact-phone">Phone</label>

          <input
            id="contact-phone"
            type="tel"
            placeholder="Phone"
            autoComplete="tel"
            aria-invalid={Boolean(errors.telephone)}
            aria-describedby={
              errors.telephone ? "contact-phone-error" : undefined
            }
            {...register("telephone")}
          />

          {errors.telephone && (
            <p id="contact-phone-error" className="error" role="alert">
              {errors.telephone.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="contact-email">Email</label>

          <input
            id="contact-email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email")}
          />

          {errors.email && (
            <p id="contact-email-error" className="error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <button className="submit-button" type="submit">
          Register
        </button>
      </FormStyle>
    </Container>
  );
};

export default FormContactRegister;
