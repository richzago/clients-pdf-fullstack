import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import type { InferType } from "yup";

import { AuthContext } from "../../../contexts/AuthContext";
import { schemaClientRegister } from "../../../validations/validationRegister";

import { Container, FormStyle } from "./style";

type ClientRegisterFormData = InferType<typeof schemaClientRegister>;

export const FormClientRegister = () => {
  const navigate = useNavigate();
  const { clientRegister } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRegisterFormData>({
    resolver: yupResolver(schemaClientRegister),
  });

  const onSubmitFunction = (data: ClientRegisterFormData) => {
    clientRegister(data);
  };

  return (
    <Container>
      <FormStyle noValidate onSubmit={handleSubmit(onSubmitFunction)}>
        <h2>Create your account</h2>

        <p className="subtitle">
          Register to manage your clients and contacts.
        </p>

        <div className="field">
          <label htmlFor="register-name">Full Name</label>

          <input
            id="register-name"
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            {...register("name")}
          />

          {errors.name && (
            <p id="register-name-error" className="error" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="register-email">Email</label>

          <input
            id="register-email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />

          {errors.email && (
            <p id="register-email-error" className="error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="register-phone">Phone</label>

          <input
            id="register-phone"
            type="tel"
            placeholder="Phone"
            autoComplete="tel"
            aria-invalid={Boolean(errors.telephone)}
            aria-describedby={
              errors.telephone ? "register-phone-error" : undefined
            }
            {...register("telephone")}
          />

          {errors.telephone && (
            <p id="register-phone-error" className="error" role="alert">
              {errors.telephone.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="register-password">Password</label>

          <input
            id="register-password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "register-password-error" : undefined
            }
            {...register("password")}
          />

          {errors.password && (
            <p id="register-password-error" className="error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <button className="submit-button" type="submit">
          Register
        </button>

        <button
          className="back-button"
          type="button"
          onClick={() => navigate("/login")}
        >
          Back
        </button>
      </FormStyle>
    </Container>
  );
};
