import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import { Container, FormStyle } from "./style";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaContactRegister } from "../../../validations/validationRegister";
import { InferType } from "yup";

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
      <FormStyle onSubmit={handleSubmit(onSubmitFunction)}>
        <h2>Register Contact</h2>
        <input type="text" placeholder="Full Name" {...register("name")} />
        <p className="error">{errors.name?.message}</p>

        <input type="text" placeholder="Phone" {...register("telephone")} />
        <p className="error">{errors.telephone?.message}</p>

        <input type="text" placeholder="Email" {...register("email")} />
        <p className="error">{errors.email?.message}</p>

        <button className="btn" type="submit">
          Register
        </button>
      </FormStyle>
    </Container>
  );
};
export default FormContactRegister;
