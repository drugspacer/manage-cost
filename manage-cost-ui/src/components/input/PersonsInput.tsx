import Person from "../../models/person.model";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import React, { FC, useEffect, useState } from "react";
import { getPersons } from "../../api/persons";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import { PersonAutocomplete } from "../../models/form.model";

type PersonInputProps = {
  value: (string | Person)[];
  error?: string | string[];
  onChange: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["onChange"];
  fetch?: boolean;
};

const filter = createFilterOptions<Person | PersonAutocomplete>();

const PersonsInput: FC<PersonInputProps> = ({
  value,
  error,
  onChange,
  fetch = true,
}) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fetch) {
      setIsLoading(true);
      getPersons().then((data) => {
        setPersons(data);
        setIsLoading(false);
      });
    }
  }, []);

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

  return (
    <Autocomplete<Person | PersonAutocomplete, true, false, true>
      id="persons"
      multiple
      onChange={onChange}
      filterOptions={filterOptions}
      disableCloseOnSelect
      freeSolo
      handleHomeEndKeys
      loading={isLoading}
      getOptionLabel={getOptionLabel}
      filterSelectedOptions
      options={persons}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Участники *"
          placeholder="Добавить ещё"
          helperText={error}
          error={!!error}
        />
      )}
      value={value}
    />
  );
};

export default PersonsInput;
