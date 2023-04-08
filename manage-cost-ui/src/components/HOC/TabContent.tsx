import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";

const TabContent = ({ children }: PropsWithChildren) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>{children}</Box>
  );
};

TabContent.muiName = "Box";

export default TabContent;
