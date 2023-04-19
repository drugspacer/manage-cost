import React, { memo, PropsWithChildren } from "react";
import TabList, { TabListProps } from "@mui/lab/TabList";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";
import { useTranslation } from "react-i18next";

const Tabs = ({
  children,
  onChange,
}: PropsWithChildren<Pick<TabListProps, "onChange">>) => {
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );
  const { t } = useTranslation("profile", { keyPrefix: "ariaLabel" });

  return (
    <TabList
      orientation={isMobile ? "horizontal" : "vertical"}
      onChange={onChange}
      aria-label={t("profileTabs")}
      variant={isMobile ? "fullWidth" : "standard"}
      sx={isMobile ? { width: "100%" } : {}}
    >
      {children}
    </TabList>
  );
};

Tabs.muiName = "TabList";

export default memo(Tabs);
