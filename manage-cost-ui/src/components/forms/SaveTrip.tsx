import React, {
  ChangeEventHandler,
  DOMAttributes,
  FC,
  useCallback,
  useState,
} from "react";
import Person from "../../models/person.model";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import { PersonAutocomplete, TripForm, TripRq } from "../../models/form.model";
import ErrorState from "../../models/error.model";
import {
  required,
  SimpleValidateConfig,
  validateField,
  simpleFormValidation,
} from "../../functions/validation";
import { Id, Version } from "../../models/model";
import FormWrapper from "../HOC/FormWrapper";
import TextInput from "../input/TextInput";
import PersonsInput from "../input/PersonsInput";
import { personsToDataRq } from "../../functions/apiTransform";

const formConfig: SimpleValidateConfig<TripForm> = {
  place: [required],
  name: [required],
  persons: [required],
};

const SaveTrip: FC<{
  onSubmit: (data: TripRq) => void;
  trip?: TripForm;
}> = ({
  onSubmit,
  trip = {
    place: "",
    name: "",
    persons: [],
  },
}) => {
  const [state, setState] = useState<TripForm>(trip);
  const [errorState, setErrorState] = useState<ErrorState<TripForm>>({});

  const submitHandler: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    e
  ) => {
    e.preventDefault();
    const errors = simpleFormValidation(state, formConfig);
    if (!!errors) {
      setErrorState(errors);
      return;
    }
    onSubmit({ ...state, persons: personsToDataRq(state.persons) });
  };

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
        persons: validateField(persons, formConfig.persons!),
      }));
    }
  };

  const onTextChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      const name = target.name as keyof Omit<
        TripForm,
        "persons" | keyof Id | keyof Version
      >;
      setState((prevVal) => ({ ...prevVal, [name]: target.value }));
      if (errorState[name]) {
        setErrorState((prevState) => ({
          ...prevState,
          [name]: validateField(target.value, formConfig[name]!),
        }));
      }
    },
    []
  );

  return (
    <FormWrapper
      onSubmit={submitHandler}
      submitText={state.id ? "Редактировать" : "Создать"}
    >
      <TextInput<TripForm>
        name="name"
        label="Название *"
        state={state}
        onChange={onTextChange}
        errorState={errorState}
      />
      <PersonsInput
        onChange={onPersonChange}
        value={state.persons}
        error={errorState?.persons}
      />
      <TextInput<TripForm>
        name="place"
        label="Место *"
        errorState={errorState}
        state={state}
        onChange={onTextChange}
      />
    </FormWrapper>
  );
};

export default SaveTrip;
