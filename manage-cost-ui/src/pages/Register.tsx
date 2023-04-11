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
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import Person from "../models/person.model";
import { PersonAutocomplete } from "../models/form.model";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/Auth";
import StyledPaper from "../components/UI/styled/StyledPaper";
import Typography from "@mui/material/Typography";
import { registerToUserRq } from "../functions/apiTransform";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import reducer from "../functions/reducer";

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
  const { t } = useTranslation("auth");

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
    await register(registerToUserRq(state.form));
    navigate("/");
  };

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) =>
      dispatch({ type: "change", payload: { [target.name]: target.value } }),
    []
  );

  const onPersonChange: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["onChange"] = (_e, newValue) =>
    dispatch({
      type: "personChange",
      payload: newValue.map((item) => {
        if (typeof item === "string") {
          return item;
        } else if ("title" in item) {
          return item.name;
        }
        return item;
      }),
    });

  const linkOnLogin = (
    <Typography sx={{ textAlign: "center" }} variant="body2">
      <Link href="/login">{t("register.backToLogin")}</Link>
    </Typography>
  );

  console.log("Register render");

  return (
    <Page header={t("register.header")}>
      <StyledPaper elevation={6}>
        <FormWrapper
          onSubmit={submitHandler}
          submitText={t("register.submit")}
          additionalNode={linkOnLogin}
        >
          <TextInput
            name="username"
            label={t("loginInput")}
            errorState={state.error}
            state={state.form}
            onChange={changeHandler}
          />
          <Password
            value={state.form.password}
            label={t("passwordInput")}
            onChange={changeHandler}
            error={!!state.error.password}
            helperText={state.error.password}
            autoComplete="new-password"
          />
          <Password
            value={state.form.confirmPassword}
            onChange={changeHandler}
            error={!!state.error.confirmPassword}
            helperText={state.error.confirmPassword}
            label={t("register.confirmPassword")}
            name="confirmPassword"
          />
          <PersonsInput
            value={state.form.persons}
            onChange={onPersonChange}
            required={false}
          />
        </FormWrapper>
      </StyledPaper>
    </Page>
  );
};

export default memo(Register);
