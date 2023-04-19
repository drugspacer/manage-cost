import React from "react";
import TextField from "@mui/material/TextField";
import ErrorState from "../../models/error.model";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";
import { useTranslation } from "react-i18next";
import { TFuncKey } from "i18next";

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
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );
  const { t } = useTranslation();

  return (
    <TextField
      {...rest}
      id={name}
      variant="outlined"
      name={name}
      error={!!errorState[name]}
      helperText={
        errorState[name]
          ? (t(
              `validationError.${errorState[name]}` as TFuncKey<"common">
            ) as string)
          : undefined
      }
      value={state[name]}
      margin={isMobile ? "dense" : "normal"}
      fullWidth={isMobile}
    />
  );
};

TextInput.muiName = "TextField";

export default TextInput;
