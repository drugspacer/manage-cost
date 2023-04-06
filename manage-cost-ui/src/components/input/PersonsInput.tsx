import Person from "../../models/person.model";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import React, { memo, ReactNode, useContext } from "react";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import { PersonAutocomplete } from "../../models/form.model";
import { AuthContext } from "../../context/Auth";
import Box from "@mui/material/Box";
import { TextFieldProps } from "@mui/material/TextField/TextField";

type PersonInputProps = {
  value: (string | Person)[];
  error?: string | string[];
  onChange: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["onChange"];
  readonly?: boolean;
  button?: ReactNode;
  margin?: TextFieldProps["margin"];
};

const filter = createFilterOptions<Person | PersonAutocomplete>();

const PersonsInput = ({
  value,
  error,
  onChange,
  readonly = false,
  button,
  margin = "normal",
}: PersonInputProps) => {
  const { user } = useContext(AuthContext);

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
    <Autocomplete<Person | PersonAutocomplete, true, true, true>
      id="persons"
      multiple
      onChange={onChange}
      filterOptions={filterOptions}
      disableCloseOnSelect
      freeSolo
      handleHomeEndKeys
      disableClearable
      getOptionLabel={getOptionLabel}
      filterSelectedOptions
      options={user?.persons ?? []}
      readOnly={readonly}
      renderInput={(params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            {...params}
            label="Участники *"
            placeholder={readonly ? "" : "Добавить ещё"}
            helperText={error}
            error={!!error}
            margin={margin}
          />
          {button}
        </Box>
      )}
      value={value}
    />
  );
};

PersonsInput.muiName = "Autocomplete";

export default memo(PersonsInput);
