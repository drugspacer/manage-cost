import React, {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import Stack from "@mui/material/Stack";
import FormWrapper from "../HOC/FormWrapper";
import PasswordInput from "../input/Password";
import ErrorState from "../../models/error.model";
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
  const [state, setState] = useState<PasswordForm>({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [errorState, setErrorState] = useState<ErrorState<PasswordForm>>({});

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      console.log(target);
      setState((prevState) => ({ ...prevState, [target.name]: target.value }));
    },
    []
  );

  const submitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    const complexErrors = complexFormValidation(state, complexValidationConfig);
    if (!!errors || !!complexErrors) {
      setErrorState({ ...errors, ...complexErrors });
      return;
    }
    await UserApi.changePassword({
      oldPassword: state.oldPassword,
      password: state.password,
    });
  };

  console.log("PasswordForm render");

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Изменить пароль</Typography>
      <FormWrapper submitText="Изменить пароль" onSubmit={submitHandler}>
        <PasswordInput
          label="Старый пароль *"
          name="oldPassword"
          autoComplete="new-password"
          value={state.oldPassword}
          onChange={changeHandler}
          error={!!errorState.oldPassword}
          helperText={errorState.oldPassword}
        />
        <PasswordInput
          label="Новый пароль *"
          value={state.password}
          onChange={changeHandler}
          error={!!errorState.password}
          helperText={errorState.password}
        />
        <PasswordInput
          label="Подтвердить новый пароль *"
          name="confirmPassword"
          value={state.confirmPassword}
          onChange={changeHandler}
          error={!!errorState.confirmPassword}
          helperText={errorState.confirmPassword}
        />
      </FormWrapper>
    </Stack>
  );
};

Password.muiName = "Stack";

export default Password;
