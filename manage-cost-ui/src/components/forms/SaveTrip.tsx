import React, {
  ChangeEventHandler,
  DOMAttributes,
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
import { useTranslation } from "react-i18next";

const formConfig: SimpleValidateConfig<TripForm> = {
  place: [required],
  name: [required],
  persons: [required],
};

const SaveTrip = ({
  onSubmit,
  trip = {
    place: "",
    name: "",
    persons: [],
  },
}: {
  onSubmit: (data: TripRq) => void;
  trip?: TripForm;
}) => {
  const [state, setState] = useState<TripForm>(trip);
  const [errorState, setErrorState] = useState<ErrorState<TripForm>>({});
  const { t: common } = useTranslation();
  const { t: tripTranslate } = useTranslation("trip", { keyPrefix: "trip" });

  const submitHandler: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    e
  ) => {
    e.preventDefault();
    const errors = simpleFormValidation(state, formConfig);
    if (!!errors) {
      setErrorState(errors);
      return;
    }
    await onSubmit({ ...state, persons: personsToDataRq(state.persons) });
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

  console.log("SaveTrip render");

  return (
    <FormWrapper
      onSubmit={submitHandler}
      submitText={state.id ? common("button.edit") : common("button.create")}
    >
      <TextInput<TripForm>
        name="name"
        label={tripTranslate("name")}
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
        label={tripTranslate("place")}
        errorState={errorState}
        state={state}
        onChange={onTextChange}
      />
    </FormWrapper>
  );
};

SaveTrip.muiName = FormWrapper.muiName;

export default SaveTrip;
