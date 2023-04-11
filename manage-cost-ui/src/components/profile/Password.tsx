import React, {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useReducer,
} from "react";
import Stack from "@mui/material/Stack";
import FormWrapper from "../HOC/FormWrapper";
import PasswordInput from "../input/Password";
import {
  complexFormValidation,
  ComplexValidateConfig,
  confirmPassword,
  minLength,
  required,
  simpleFormValidation,
  SimpleValidateConfig,
} from "../../functions/validation";
import UserApi from "../../service/api/user";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import reducer from "../../functions/reducer";

type PasswordForm = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

const simpleValidationConfig: SimpleValidateConfig<PasswordForm> = {
  oldPassword: [required, minLength(8)],
  password: [required, minLength(8)],
  confirmPassword: [required],
};

const complexValidationConfig: ComplexValidateConfig<PasswordForm> = {
  confirmPassword: [confirmPassword],
};

const Password = () => {
  const [state, dispatch] = useReducer(
    reducer<PasswordForm>(simpleValidationConfig, complexValidationConfig),
    {
      form: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      error: {},
    }
  );
  const { t } = useTranslation("profile", { keyPrefix: "password" });

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) =>
      dispatch({ type: "change", payload: { [target.name]: target.value } }),
    []
  );

  const submitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state.form, simpleValidationConfig);
    const complexErrors = complexFormValidation(
      state.form,
      complexValidationConfig
    );
    if (!!errors || !!complexErrors) {
      dispatch({ type: "setError", payload: { ...errors, ...complexErrors } });
      return;
    }
    await UserApi.changePassword({
      oldPassword: state.form.oldPassword,
      password: state.form.password,
    });
  };

  console.log("PasswordForm render");

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t("header")}</Typography>
      <FormWrapper submitText={t("submit")} onSubmit={submitHandler}>
        <PasswordInput
          label={t("oldPassword")}
          name="oldPassword"
          autoComplete="new-password"
          value={state.form.oldPassword}
          onChange={changeHandler}
          error={!!state.error.oldPassword}
          helperText={state.error.oldPassword}
        />
        <PasswordInput
          label={t("newPassword")}
          value={state.form.password}
          onChange={changeHandler}
          error={!!state.error.password}
          helperText={state.error.password}
        />
        <PasswordInput
          label={t("confirmNewPassword")}
          name="confirmPassword"
          value={state.form.confirmPassword}
          onChange={changeHandler}
          error={!!state.error.confirmPassword}
          helperText={state.error.confirmPassword}
        />
      </FormWrapper>
    </Stack>
  );
};

Password.muiName = "Stack";

export default Password;
