import React, { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ backgroundColor: "grey.600", marginTop: 2, padding: 1 }}>
      <Link
        component="a"
        href="https://github.com/drugspacer"
        color="common.white"
        underline="none"
        target="_blank"
      >
        <Typography typography="body2">{t("created")}</Typography>
      </Link>
      <Typography align="center" typography="body2" color="common.white">
        2023
      </Typography>
    </Box>
  );
};

Footer.muiName = "Box";

export default memo(Footer);
