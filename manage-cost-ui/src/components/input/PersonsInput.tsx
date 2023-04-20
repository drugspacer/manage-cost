import Person from "../../models/person.model";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import React, { memo, ReactNode, useContext } from "react";
import { UseAutocompleteProps } from "@mui/base/useAutocomplete";
import { PersonAutocomplete } from "../../models/form.model";
import { AuthContext } from "../../context/Auth";
import Box from "@mui/material/Box";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import { useTranslation } from "react-i18next";

type PersonInputProps = {
  value: Person[];
  error?: string | string[];
  onChange?: (person: Person[]) => void;
  readonly?: boolean;
  required?: boolean;
  button?: ReactNode;
  margin?: TextFieldProps["margin"];
  helperText?: string;
};

const filter = createFilterOptions<Person | PersonAutocomplete>();

const PersonsInput = ({
  value,
  error,
  onChange,
  readonly = false,
  required = true,
  button,
  margin = "normal",
  helperText,
}: PersonInputProps) => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

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
        inputValue: t("input.addItem", { item: inputValue }),
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
    } else if ("inputValue" in option) {
      return option.inputValue;
    } else if ("name" in option) {
      return option.name;
    }
    return option;
  };

  const changeHandler = (
    _e: React.SyntheticEvent,
    newValue: (Person | PersonAutocomplete | string)[]
  ) => {
    const persons = newValue.map<Person>((item) => {
      if (typeof item === "string") {
        return {
          name: item,
        };
      } else if ("title" in item) {
        return {
          name: item.name,
        };
      }
      return item;
    });
    onChange && onChange(persons);
  };

  const labelText = t("input.participant");

  return (
    <Autocomplete<Person | PersonAutocomplete, true, true, true>
      id="persons"
      multiple
      onChange={changeHandler}
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
            label={required ? `${labelText} *` : labelText}
            placeholder={readonly ? "" : t("input.addMore")}
            helperText={error ?? helperText}
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
