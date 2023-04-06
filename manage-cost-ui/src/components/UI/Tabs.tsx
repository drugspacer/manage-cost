import React, { PropsWithChildren } from "react";
import TabList, { TabListProps } from "@mui/lab/TabList";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";

const Tabs = ({
  children,
  onChange,
}: PropsWithChildren<Pick<TabListProps, "onChange">>) => {
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );

  console.log("Tabs render");

  return (
    <TabList
      orientation={isMobile ? "horizontal" : "vertical"}
      onChange={onChange}
      aria-label="Profile tabs"
      variant={isMobile ? "fullWidth" : "standard"}
      sx={isMobile ? { width: "100%" } : {}}
    >
      {children}
    </TabList>
  );
};

Tabs.muiName = "TabList";

export default Tabs;
