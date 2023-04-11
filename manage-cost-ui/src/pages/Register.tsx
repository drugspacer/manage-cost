import React, {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  memo,
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
  validateForm,
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

const simpleValidationConfig: SimpleValidateConfig<RegisterModel> = {
  username: [required],
  password: [required, minLength(8)],
  confirmPassword: [required],
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
  const { t } = useTranslation("auth");

  const submitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    const complexErrors = complexFormValidation(state, complexValidationConfig);
    if (!!errors || !!complexErrors) {
      setErrorState({ ...complexErrors, ...errors });
      return;
    }
    await register(registerToUserRq(state));
    navigate("/");
  };

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      const name = target.name as keyof Omit<RegisterModel, "persons">;
      setState((prevState) => ({
        ...prevState,
        [name]: target.value,
      }));
      if (errorState[name]) {
        let error: string[] | string | undefined = undefined;
        if (complexValidationConfig[name]) {
          //I know there is use reducer needed.
          error = validateForm(
            { ...state, [name]: target.value },
            complexValidationConfig[name]!
          );
        }
        error = validateField(target.value, simpleValidationConfig[name]!);
        setErrorState((prevState) => ({
          ...prevState,
          [name]: error,
        }));
      }
    },
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
  };

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
            autoComplete="new-password"
          />
          <Password
            value={state.confirmPassword}
            onChange={changeHandler}
            error={!!errorState.confirmPassword}
            helperText={errorState.confirmPassword}
            label={t("register.confirmPassword")}
            name="confirmPassword"
          />
          <PersonsInput
            value={state.persons}
            onChange={onPersonChange}
            required={false}
          />
        </FormWrapper>
      </StyledPaper>
    </Page>
  );
};

export default memo(Register);
