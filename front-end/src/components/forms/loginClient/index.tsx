import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext, IDataClientLogin } from "../../../contexts/AuthContext";
import { Container, FormLogin } from "./style";
import { BiShow } from "react-icons/bi";
import { AiOutlineEyeInvisible } from "react-icons/ai";

const LoginClient = () => {
  const { clientLogin } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDataClientLogin>({});

  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const onSubmitFunction = (data: IDataClientLogin) => {
    setLoad(true);
    clientLogin(data);
    setLoad(false);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Container>
      <FormLogin onSubmit={handleSubmit(onSubmitFunction)}>
        <h2>Sign in</h2>
        <input placeholder="Email" {...register("email")} />
        <p>{errors.email?.message}</p>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password")}
        />
        {!showPassword ? (
          <BiShow onClick={() => setShowPassword(!showPassword)} />
        ) : (
          <AiOutlineEyeInvisible
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
        <p>{errors.password?.message}</p>

        <button type="submit" disabled={load}>
          {load ? "Loading..." : "Login"}
        </button>

        <h6>Don't have an account?</h6>
        <button
          className="btnRegister"
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
