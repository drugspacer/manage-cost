import React, {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  memo,
  useCallback,
  useContext,
  useReducer,
} from "react";
import Page from "../components/Layout/Page";
import FormWrapper from "../components/HOC/FormWrapper";
import {
  complexFormValidation,
  ComplexValidateConfig,
  confirmPassword,
  minLength,
  required,
  simpleFormValidation,
  SimpleValidateConfig,
} from "../functions/validation";
import { Register as RegisterModel } from "../models/login.model";
import TextInput from "../components/input/TextInput";
import Password from "../components/input/Password";
import PersonsInput from "../components/input/PersonsInput";
import Person from "../models/person.model";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/Auth";
import StyledPaper from "../components/UI/styled/StyledPaper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import reducer from "../functions/reducer";
import { TFuncKey } from "i18next";
import { isErrorRs } from "../functions/apiTransform";
import Welcome from "../components/UI/Welcome";

const simpleValidationConfig: SimpleValidateConfig<RegisterModel> = {
  username: [required],
  password: [required, minLength(8)],
  confirmPassword: [required],
};

const complexValidationConfig: ComplexValidateConfig<RegisterModel> = {
  confirmPassword: [confirmPassword],
};

const Register: FC = () => {
  const [state, dispatch] = useReducer(
    reducer<RegisterModel>(simpleValidationConfig, complexValidationConfig),
    {
      form: {
        username: "",
        password: "",
        confirmPassword: "",
        persons: [],
      },
      error: {},
    }
  );
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const { t: auth } = useTranslation("auth");
  const { t: common } = useTranslation();

  const submitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state.form, simpleValidationConfig);
    const complexErrors = complexFormValidation(
      state.form,
      complexValidationConfig
    );
    if (!!errors || !!complexErrors) {
      dispatch({ type: "setError", payload: { ...complexErrors, ...errors } });
      return;
    }
    try {
      await register(state.form);
      navigate("/trips");
    } catch (error) {
      if (isErrorRs(error) && error.validationMessages) {
        dispatch({ type: "setError", payload: error.validationMessages });
      }
    }
  };

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) =>
      dispatch({ type: "change", payload: { [target.name]: target.value } }),
    []
  );

  const onPersonChange = useCallback(
    (persons: Person[]) =>
      dispatch({
        type: "personChange",
        payload: persons,
      }),
    []
  );

  const linkOnLogin = (
    <Typography sx={{ textAlign: "center" }} variant="body2">
      <Link href="/login">{auth("register.backToLogin")}</Link>
    </Typography>
  );

  return (
    <Page header={auth("register.header")}>
      <Welcome />
      <StyledPaper elevation={6} sx={{ maxWidth: "400px" }}>
        <FormWrapper
          onSubmit={submitHandler}
          submitText={auth("register.submit")}
          additionalNode={linkOnLogin}
        >
          <TextInput
            name="username"
            label={auth("loginInput")}
            errorState={state.error}
            state={state.form}
            onChange={changeHandler}
          />
          <Password
            value={state.form.password}
            label={auth("passwordInput")}
            onChange={changeHandler}
            error={!!state.error.password}
            helperText={
              state.error.password
                ? (common(
                    `validationError.${state.error.password}` as TFuncKey<"common">,
                    { minLength: 8 }
                  ) as string)
                : undefined
            }
            autoComplete="new-password"
          />
          <Password
            value={state.form.confirmPassword}
            onChange={changeHandler}
            error={!!state.error.confirmPassword}
            helperText={
              state.error.confirmPassword
                ? (common(
                    `validationError.${state.error.confirmPassword}` as TFuncKey<"common">
                  ) as string)
                : undefined
            }
            label={auth("register.confirmPassword")}
            name="confirmPassword"
          />
          <PersonsInput
            value={state.form.persons}
            onChange={onPersonChange}
            required={false}
            helperText={auth("register.personsInfo")}
          />
        </FormWrapper>
      </StyledPaper>
    </Page>
  );
};

export default memo(Register);
