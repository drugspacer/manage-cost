import React, {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import Page from "../components/Layout/Page";
import FormWrapper from "../components/HOC/FormWrapper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ErrorState from "../models/error.model";
import {
  required,
  simpleFormValidation,
  SimpleValidateConfig,
} from "../functions/validation";
import LoginModel from "../models/login.model";
import { login } from "../api/login";
import { useNavigate } from "react-router";
import TextInput from "../components/input/TextInput";
import Password from "../components/input/Password";

const simpleValidationConfig: SimpleValidateConfig<LoginModel> = {
  login: [required],
  password: [required],
};

const Login: FC = () => {
  const [state, setState] = useState<LoginModel>({
    login: "",
    password: "",
    rememberMe: true,
  });
  const [errorState, setErrorState] = useState<ErrorState<LoginModel>>({});
  const navigate = useNavigate();

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    if (!!errors) {
      setErrorState(errors);
      return;
    }
    login(state);
  };

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) =>
      setState((prevState) => ({
        ...prevState,
        [target.name]:
          target.name === "rememberMe" ? target.checked : target.value,
      })),
    []
  );

  const button = {
    text: "Зарегистрироваться",
    handler: () => navigate(`/register`),
  };

  return (
    <Page
      breadcrumbs={[{ label: "Логин", href: "/login" }]}
      mainButton={button}
    >
      <FormWrapper onSubmit={submitHandler} submitText="Войти">
        <TextInput
          name="login"
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
        <FormControlLabel
          control={
            <Checkbox
              id="rememberMe"
              onChange={changeHandler}
              name="rememberMe"
              checked={state.rememberMe}
            />
          }
          label="Запомнить меня"
        />
      </FormWrapper>
    </Page>
  );
};

export default Login;
