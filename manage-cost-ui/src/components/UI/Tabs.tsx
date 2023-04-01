import React, { FC, PropsWithChildren } from "react";
import TabList, { TabListProps } from "@mui/lab/TabList";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";

const Tabs: FC<PropsWithChildren<Pick<TabListProps, "onChange">>> = ({
  children,
  onChange,
}) => {
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );

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

export default Tabs;
