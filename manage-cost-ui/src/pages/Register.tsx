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
import TextInput from "../components/input/TextInput";
import Password from "../components/input/Password";
import PersonsInput from "../components/input/PersonsInput";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import Person from "../models/person.model";
import { PersonAutocomplete } from "../models/form.model";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/Auth";
import StyledPaper from "../components/UI/styled/StyledPaper";
import Typography from "@mui/material/Typography";
import { registerToUserRq } from "../functions/apiTransform";

const simpleValidationConfig: SimpleValidateConfig<RegisterModel> = {
  username: [required],
  password: [required, minLength(8)],
  confirmPassword: [required],
  persons: [required],
};

const complexValidationConfig: ComplexValidateConfig<RegisterModel> = {
  confirmPassword: [confirmPassword],
};

const Register: FC = () => {
  const [state, setState] = useState<RegisterModel>({
    username: "",
    password: "",
    confirmPassword: "",
    persons: [],
  });
  const [errorState, setErrorState] = useState<ErrorState<RegisterModel>>({});
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const submitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    const complexErrors = complexFormValidation(state, complexValidationConfig);
    if (!!errors || !!complexErrors) {
      setErrorState({ ...errors, ...complexErrors });
      return;
    }
    await register(registerToUserRq(state));
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

  const onPersonChange: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["onChange"] = (_e, newValue) => {
    const persons = newValue.map((item) => {
      if (typeof item === "string") {
        return item;
      } else if ("title" in item) {
        return item.name;
      }
      return item;
    });
    setState((prevState) => ({ ...prevState, persons }));
    if (!!errorState?.persons) {
      setErrorState((prevState) => ({
        ...prevState,
        persons: validateField(persons, simpleValidationConfig.persons!),
      }));
    }
  };

  const linkOnLogin = (
    <Link sx={{ textAlign: "center" }} href="/login">
      <Typography variant="body2">Назад на страницу логина</Typography>
    </Link>
  );

  return (
    <Page header="Регистрация">
      <StyledPaper elevation={6}>
        <FormWrapper
          onSubmit={submitHandler}
          submitText="Зарегистрироваться"
          additionalNode={linkOnLogin}
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
          <Password
            value={state.confirmPassword}
            onChange={changeHandler}
            error={!!errorState.confirmPassword}
            helperText={errorState.confirmPassword}
            label="Подтвердить пароль *"
            name="confirmPassword"
          />
          <PersonsInput
            value={state.persons}
            onChange={onPersonChange}
            error={errorState.persons}
            fetch={false}
          />
        </FormWrapper>
      </StyledPaper>
    </Page>
  );
};

export default Register;
