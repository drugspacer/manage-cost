import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import Divider from "@mui/material/Divider";

const Welcome = () => {
  const { t } = useTranslation("auth", { keyPrefix: "welcome" });

  return (
    <>
      <Typography variant="h4" textAlign="center">
        {t("textHeader")}
      </Typography>
      <Typography textAlign="center">{t("textBody")}</Typography>
      <Typography variant="body2" textAlign="center">
        {t("textFooter")}
      </Typography>
      <Divider />
    </>
  );
};

export default memo(Welcome);
