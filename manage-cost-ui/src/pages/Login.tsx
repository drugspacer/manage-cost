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
} from "../functions/validation";
import LoginModel from "../models/login.model";
import TextInput from "../components/input/TextInput";
import Password from "../components/input/Password";
import Link from "@mui/material/Link";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router";
import StyledPaper from "../components/UI/styled/StyledPaper";
import Typography from "@mui/material/Typography";

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
    ({ target }) =>
      setState((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      })),
    []
  );

  const linkToRegistration = (
    <Link sx={{ textAlign: "center" }} href="/register">
      <Typography variant="body2">Зарегистрироваться</Typography>
    </Link>
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
