import React, {
  ChangeEventHandler,
  DOMAttributes,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { getPersons } from "../../api/persons";
import Person from "../../models/person.model";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import { Input, TripForm, TripRq } from "../../models/form.model";
import ErrorState from "../../models/error.model";
import {
  required,
  SimpleValidateConfig,
  validateField,
  simpleFormValidation,
} from "../../functions/validation";
import { Id, Version } from "../../models/model";

type PersonAutocomplete = Pick<Person, "name"> & { title: string };

const filter = createFilterOptions<Person | PersonAutocomplete>();

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
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<TripForm>(trip);
  const [errorState, setErrorState] = useState<ErrorState<TripForm>>({});

  useEffect(() => {
    setIsLoading(true);
    getPersons().then((data) => {
      setPersons(data);
      setIsLoading(false);
    });
  }, []);

  const submitHandler: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    e
  ) => {
    e.preventDefault();
    const errors = simpleFormValidation(state, formConfig);
    if (!!errors) {
      setErrorState(errors);
      return;
    }
    const persons = state.persons.map<Input<Person>>((item) =>
      typeof item === "string" ? { name: item } : item
    );
    onSubmit({ ...state, persons });
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

  const getOptionLabel: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["getOptionLabel"] = (option) => {
    if (typeof option === "string") {
      return option;
    } else if ("title" in option) {
      return option.title;
    } else if ("name" in option) {
      return option.name;
    }
    return option;
  };

  const filterOptions: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["filterOptions"] = (options, state) => {
    const filtered = filter(options, state);
    const { inputValue } = state;
    // Suggest the creation of a new value
    if (
      inputValue !== "" &&
      !options.some((option) => inputValue === option.name)
    ) {
      filtered.push({
        name: inputValue,
        title: `Добавить "${inputValue}"`,
      });
    }
    return filtered;
  };

  return (
    <form onSubmit={submitHandler}>
      <Stack spacing={3}>
        <TextField
          id="name"
          label="Название *"
          variant="outlined"
          name="name"
          error={!!errorState?.name}
          helperText={errorState?.name}
          onChange={onTextChange}
          value={state.name}
        />
        <Autocomplete<Person | PersonAutocomplete, true, false, true>
          id="persons"
          multiple
          onChange={onPersonChange}
          filterOptions={filterOptions}
          disableCloseOnSelect
          freeSolo
          handleHomeEndKeys
          loading={isLoading}
          getOptionLabel={getOptionLabel}
          filterSelectedOptions
          options={persons || []}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Участники *"
              placeholder="Добавить ещё"
              helperText={errorState?.persons}
              error={!!errorState?.persons}
            />
          )}
          value={state.persons}
        />
        <TextField
          id="place"
          label="Место *"
          variant="outlined"
          name="place"
          error={!!errorState?.place}
          helperText={errorState?.place}
          onChange={onTextChange}
          value={state.place}
        />
        <Button variant="contained" type="submit">
          {state.id ? "Редактировать" : "Создать"}
        </Button>
      </Stack>
    </form>
  );
};

export default SaveTrip;
