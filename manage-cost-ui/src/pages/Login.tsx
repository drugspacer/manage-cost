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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("auth");

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
      <Link href="/register">{t("login.registerLink")}</Link>
    </Typography>
  );

  return (
    <Page header={t("login.header")}>
      <StyledPaper elevation={6}>
        <FormWrapper
          onSubmit={submitHandler}
          submitText={t("login.submit")}
          additionalNode={linkToRegistration}
        >
          <TextInput
            name="username"
            label={t("loginInput")}
            errorState={errorState}
            state={state}
            onChange={changeHandler}
          />
          <Password
            value={state.password}
            label={t("passwordInput")}
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
