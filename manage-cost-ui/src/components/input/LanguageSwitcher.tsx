import React from "react";
import { useTranslation } from "react-i18next";
import RuIcon from "../UI/svg/RuIcon";
import EnIcon from "../UI/svg/EnIcon";
import theme from "../../themes/theme";
import IconButton from "@mui/material/IconButton";
import { useSnackbar } from "notistack";

const flagMap = {
  en: EnIcon,
  ru: RuIcon,
} as const;

const LanguageSwitcher = ({ onClose }: { onClose?: () => void }) => {
  const { i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const langToChange = Object.keys(flagMap).filter(
    (item) => item !== i18n.language
  )[0] as keyof typeof flagMap;

  const changeLanguage = async () => {
    try {
      await i18n.changeLanguage(langToChange);
      enqueueSnackbar(t("changeLanguage"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("error.changeLanguage"));
    } finally {
      onClose && onClose();
    }
  };

  const Flag = flagMap[langToChange];

  return (
    <IconButton onClick={changeLanguage} sx={{ p: 0 }}>
      <Flag sx={{ height: theme.spacing(3), width: theme.spacing(6) }} />
    </IconButton>
  );
};

LanguageSwitcher.muiName = "IconButton";

export default LanguageSwitcher;
