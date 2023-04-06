import React from "react";
import TextField from "@mui/material/TextField";
import ErrorState from "../../models/error.model";
import { TextFieldProps } from "@mui/material/TextField/TextField";

type TextInputProps<S, E> = Omit<
  TextFieldProps,
  "id" | "variant" | "error" | "helperText" | "value" | "name"
> & {
  name: string;
  errorState: ErrorState<E>;
  state: S;
};

const TextInput = <
  S extends Record<string, unknown>,
  E extends Record<string, unknown> = S
>({
  name,
  errorState,
  state,
  ...rest
}: TextInputProps<S, E>) => {
  console.log("TextInput render");
  return (
    <TextField
      {...rest}
      id={name}
      variant="outlined"
      name={name}
      error={!!errorState[name]}
      helperText={errorState[name]}
      value={state[name]}
      margin="normal"
    />
  );
};

TextInput.muiName = "TextField";

export default TextInput;
