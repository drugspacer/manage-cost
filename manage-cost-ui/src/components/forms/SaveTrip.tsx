import React, {
  ChangeEventHandler,
  DOMAttributes,
  useCallback,
  useState,
} from "react";
import Person from "../../models/person.model";
import { TripForm } from "../../models/form.model";
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
import { useTranslation } from "react-i18next";
import { isErrorRs } from "../../functions/apiTransform";
import currency from "../../constants/currency";
import CurrencyAutocomplete from "../input/CurrencyAutocomplete";

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
    currency: "RUB",
  },
  disableCurrency = false,
}: {
  onSubmit: (data: TripForm) => void;
  trip?: TripForm;
  disableCurrency?: boolean;
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
    try {
      await onSubmit(state);
    } catch (error) {
      if (isErrorRs(error) && error.validationMessages) {
        setErrorState(error.validationMessages);
      }
    }
  };

  const onPersonChange = useCallback((persons: Person[]) => {
    setState((prevState) => ({ ...prevState, persons }));
    if (!!errorState?.persons) {
      setErrorState((prevState) => ({
        ...prevState,
        persons: validateField(persons, formConfig.persons!),
      }));
    }
  }, []);

  const onTextChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const name = target.name as keyof Omit<
      TripForm,
      "persons" | "currency" | keyof Id | keyof Version
    >;
    setState((prevVal) => ({ ...prevVal, [name]: target.value }));
    if (errorState[name]) {
      setErrorState((prevState) => ({
        ...prevState,
        [name]: validateField(target.value, formConfig[name]!),
      }));
    }
  };

  const handleCurrencyChange = useCallback(
    (_e: React.SyntheticEvent, value: keyof typeof currency) =>
      setState((prevVal) => ({ ...prevVal, currency: value })),
    []
  );

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
      <CurrencyAutocomplete
        disabled={disableCurrency}
        onChange={handleCurrencyChange}
        value={state.currency}
      />
    </FormWrapper>
  );
};

SaveTrip.muiName = FormWrapper.muiName;

export default SaveTrip;
