import React, { FC, PropsWithChildren } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const AppBarHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppBar position="static">
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
};

export default AppBarHeader;
