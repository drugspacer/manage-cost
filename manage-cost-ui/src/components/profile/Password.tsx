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
import { TFuncKey } from "i18next";

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
  const { t: profile } = useTranslation("profile", { keyPrefix: "password" });
  const { t: common } = useTranslation();

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

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{profile("header")}</Typography>
      <FormWrapper submitText={profile("submit")} onSubmit={submitHandler}>
        <PasswordInput
          label={profile("oldPassword")}
          name="oldPassword"
          autoComplete="new-password"
          value={state.form.oldPassword}
          onChange={changeHandler}
          error={!!state.error.oldPassword}
          helperText={
            state.error.oldPassword
              ? (common(
                  `validationError.${state.error.oldPassword}` as TFuncKey<"common">,
                  { minLength: 8 }
                ) as string)
              : undefined
          }
        />
        <PasswordInput
          label={profile("newPassword")}
          value={state.form.password}
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
        />
        <PasswordInput
          label={profile("confirmNewPassword")}
          name="confirmPassword"
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
        />
      </FormWrapper>
    </Stack>
  );
};

Password.muiName = "Stack";

export default Password;
