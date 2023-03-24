import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "grey.600", marginTop: 2, padding: 1 }}>
      <Link
        href="https://github.com/drugspacer"
        color="common.white"
        underline="none"
        target="_blank"
      >
        <Typography typography="body2">Created by drugspacer</Typography>
      </Link>
      <Typography align="center" typography="body2" color="common.white">
        2023
      </Typography>
    </Box>
  );
};

export default Footer;
