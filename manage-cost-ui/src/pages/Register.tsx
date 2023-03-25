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
  complexFormValidation,
  ComplexValidateConfig,
  confirmPassword,
  minLength,
  required,
  simpleFormValidation,
  SimpleValidateConfig,
  validateField,
} from "../functions/validation";
import { Register as RegisterModel } from "../models/login.model";
import { register } from "../api/login";
import TextInput from "../components/input/TextInput";
import Password from "../components/input/Password";
import PersonsInput from "../components/input/PersonsInput";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import Person from "../models/person.model";
import { PersonAutocomplete } from "../models/form.model";

const simpleValidationConfig: SimpleValidateConfig<RegisterModel> = {
  login: [required],
  password: [required, minLength(8)],
  confirmPassword: [required],
  persons: [required],
};

const complexValidationConfig: ComplexValidateConfig<RegisterModel> = {
  confirmPassword: [confirmPassword],
};

const Register: FC = () => {
  const [state, setState] = useState<RegisterModel>({
    login: "",
    password: "",
    confirmPassword: "",
    persons: [],
    rememberMe: true,
  });
  const [errorState, setErrorState] = useState<ErrorState<RegisterModel>>({});

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    const complexErrors = complexFormValidation(state, complexValidationConfig);
    if (!!errors || !!complexErrors) {
      setErrorState({ ...errors, ...complexErrors });
      return;
    }
    register(state);
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

  const onPersonChange: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["onChange"] = (_e, newValue) => {
    const persons = newValue as string[];
    setState((prevState) => ({ ...prevState, persons }));
    if (!!errorState?.persons) {
      setErrorState((prevState) => ({
        ...prevState,
        persons: validateField(persons, simpleValidationConfig.persons!),
      }));
    }
  };

  return (
    <Page breadcrumbs={[{ label: "Регистрация", href: "/register" }]}>
      <FormWrapper onSubmit={submitHandler} submitText="Зарегистрироваться">
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
        <Password
          value={state.password}
          onChange={changeHandler}
          error={!!errorState.password}
          helperText={errorState.password}
          label="Подтвердить пароль *"
          name="confirmPassword"
        />
        <PersonsInput
          value={state.persons}
          onChange={onPersonChange}
          error={errorState.persons}
          fetch={false}
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

export default Register;
