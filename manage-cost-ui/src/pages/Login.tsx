import React, {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useContext,
  useState,
} from "react";
import Page from "../components/Layout/Page";
import FormWrapper from "../components/HOC/FormWrapper";
import ErrorState from "../models/error.model";
import {
  required,
  simpleFormValidation,
  SimpleValidateConfig,
  validateField,
} from "../functions/validation";
import LoginModel from "../models/login.model";
import TextInput from "../components/input/TextInput";
import Password from "../components/input/Password";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router";
import StyledPaper from "../components/UI/styled/StyledPaper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const simpleValidationConfig: SimpleValidateConfig<LoginModel> = {
  username: [required],
  password: [required],
};

const Login: FC = () => {
  const [state, setState] = useState<LoginModel>({
    username: "",
    password: "",
  });
  const [errorState, setErrorState] = useState<ErrorState<LoginModel>>({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    if (!!errors) {
      setErrorState(errors);
      return;
    }
    await login(state);
    navigate("/");
  };

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      const name = target.name as keyof LoginModel;
      console.log(errorState[name]);
      setState((prevState) => ({
        ...prevState,
        [name]: target.value,
      }));
      if (errorState[name]) {
        setErrorState((prevState) => ({
          ...prevState,
          [name]: validateField(target.value, simpleValidationConfig[name]!),
        }));
      }
    },
    []
  );

  const linkToRegistration = (
    <Typography sx={{ textAlign: "center" }} variant="body2">
      <Link href="/register">Зарегистрироваться</Link>
    </Typography>
  );

  return (
    <Page header="Логин">
      <StyledPaper elevation={6}>
        <FormWrapper
          onSubmit={submitHandler}
          submitText="Войти"
          additionalNode={linkToRegistration}
        >
          <TextInput
            name="username"
            label="Логин *"
            errorState={errorState}
            state={state}
            onChange={changeHandler}
          />
          <Password
            value={state.password}
            onChange={changeHandler}
            error={!!errorState.password}
            helperText={errorState.password}
          />
        </FormWrapper>
      </StyledPaper>
    </Page>
  );
};

export default Login;
