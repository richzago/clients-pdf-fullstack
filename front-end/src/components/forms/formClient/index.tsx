import { useForm } from "react-hook-form";
import { Container, FormStyle } from "./style";
import { AuthContext } from "../../../contexts/AuthContext";
import { InferType } from "yup";
import { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaClientRegister } from "../../../validations/validationRegister";
import { useNavigate } from "react-router-dom";

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
      <FormStyle onSubmit={handleSubmit(onSubmitFunction)}>
        <h2>Make your registration</h2>
        <input type="text" placeholder="Full Name" {...register("name")} />
        <p className="error">{errors.name?.message}</p>

        <input
          className="error"
          type="text"
          placeholder="Email"
          {...register("email")}
        />
        <p>{errors.email?.message}</p>

        <input type="text" placeholder="Phone" {...register("telephone")} />
        <p className="error">{errors.telephone?.message}</p>

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <p className="error">{errors.password?.message}</p>

        <button className="btn" type="submit">
          Register
        </button>

        <button
          className="btnback"
          type="button"
          onClick={() => navigate("/login")}
        >
          Back
        </button>
      </FormStyle>
    </Container>
  );
};
