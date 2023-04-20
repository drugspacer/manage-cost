import React, {
  ClipboardEventHandler,
  memo,
  ReactNode,
  useCallback,
  useState,
} from "react";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import FormControl from "@mui/material/FormControl";
import { OutlinedInputProps } from "@mui/material/OutlinedInput/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import { useTranslation } from "react-i18next";

type PasswordProps = Omit<
  OutlinedInputProps,
  "id" | "type" | "endAdornment"
> & {
  helperText: ReactNode;
  label: string;
  name?: string;
};

const Password = ({
  helperText,
  label,
  name = "password",
  ...rest
}: PasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const handleMouseDownPassword = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  const clickHandler = useCallback(() => setShowPassword((show) => !show), []);

  const disablePasteHandler: ClipboardEventHandler<HTMLInputElement> =
    useCallback((e) => {
      e.preventDefault();
      return false;
    }, []);

  return (
    <FormControl variant="outlined" margin="normal">
      <InputLabel htmlFor={name} error={!!helperText}>
        {label}
      </InputLabel>
      <OutlinedInput
        {...rest}
        id={name}
        name={name}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={t("ariaLabel.togglePassword")}
              onClick={clickHandler}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        onPaste={disablePasteHandler}
      />
      <FormHelperText id="component-error-text" error={true}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

Password.muiName = "FormControl";

export default memo(Password);
