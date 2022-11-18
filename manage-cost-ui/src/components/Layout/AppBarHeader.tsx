import React, { FC } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";

const AppBarHeader: FC = () => (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit">Создать поездку</Button>
      </Toolbar>
    </AppBar>
);

export default AppBarHeader;
