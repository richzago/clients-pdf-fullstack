import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { BiShow } from "react-icons/bi";
import { AiOutlineEyeInvisible } from "react-icons/ai";

import {
  AuthContext,
  type IDataClientLogin,
} from "../../../contexts/AuthContext";

import { Container, FormLogin } from "./style";

const LoginClient = () => {
  const { clientLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDataClientLogin>();

  const onSubmitFunction = (data: IDataClientLogin) => {
    clientLogin(data);
  };

  const togglePassword = () => {
    setShowPassword((previous) => !previous);
  };

  return (
    <Container>
      <FormLogin onSubmit={handleSubmit(onSubmitFunction)}>
        <h2>Sign in</h2>

        <p className="subtitle">
          Access your account to manage clients and contacts.
        </p>

        <div className="field">
          <label htmlFor="login-email">Email</label>

          <input
            id="login-email"
            type="email"
            placeholder="Email"
            autoComplete="username"
            {...register("email")}
          />

          {errors.email && (
            <p className="error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="login-password">Password</label>

          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              {...register("password")}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible aria-hidden="true" />
              ) : (
                <BiShow aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <button className="submit-button" type="submit">
          Login
        </button>

        <p className="register-text">Don't have an account?</p>

        <button
          className="register-button"
          type="button"
          onClick={() => navigate("/clients")}
        >
          Register
        </button>
      </FormLogin>
    </Container>
  );
};

export default LoginClient;
