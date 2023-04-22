import Autocomplete from "@mui/material/Autocomplete";
import currency from "../../constants/currency";
import TextField from "@mui/material/TextField";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";
import { AutocompleteValue } from "@mui/base/useAutocomplete/useAutocomplete";

const CurrencyAutocomplete = ({
  disabled = false,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange: (
    event: React.SyntheticEvent,
    value: AutocompleteValue<keyof typeof currency, false, true, false>
  ) => void;
  value: keyof typeof currency;
}) => {
  const { t } = useTranslation("trip", { keyPrefix: "trip" });
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );

  const currencies = useMemo(
    () => Object.keys(currency) as (keyof typeof currency)[],
    []
  );

  return (
    <Autocomplete<keyof typeof currency, false, true, false>
      disabled={disabled}
      disableClearable
      autoHighlight
      autoComplete
      id="currency"
      options={currencies}
      onChange={onChange}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("currency")}
          margin={isMobile ? "dense" : "normal"}
          sx={{ width: "110px" }}
        />
      )}
    />
  );
};

export default memo(CurrencyAutocomplete);
