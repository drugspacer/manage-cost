import React, { FC, useCallback, useMemo, useState } from "react";
import Page from "../components/Layout/Page";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "../components/UI/Tabs";
import { useNavigate } from "react-router";
import Info from "../components/profile/Info";
import Password from "../components/profile/Password";
import Delete from "../components/profile/Delete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../themes/theme";
import TabContent from "../components/HOC/TabContent";
import StyledTabPanel from "../components/UI/styled/StyledTabPanel";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useTranslation } from "react-i18next";

const Profile: FC = () => {
  const [value, setValue] = useState("1");
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );
  const { t: common } = useTranslation();
  const { t: profile } = useTranslation("profile");

  const backHandler = useCallback(() => navigate("/"), []);

  const tabsChangeHandler = useCallback(
    (_e: React.SyntheticEvent, newValue: string) => setValue(newValue),
    []
  );

  const buttons = useMemo(
    () => [
      {
        text: common("button.back"),
        handler: backHandler,
        element: (
          <IconButton
            size="large"
            color="inherit"
            onClick={backHandler}
            key="back"
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
        ),
      },
    ],
    [backHandler, common]
  );

  return (
    <Page header={profile("header")} buttons={buttons}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <TabContext value={value}>
          <Tabs onChange={tabsChangeHandler}>
            <Tab label={profile("info.tab")} value="1" />
            <Tab label={profile("password.tab")} value="2" />
            <Tab label={profile("delete.tab")} value="3" />
          </Tabs>
          <StyledTabPanel value="1">
            <TabContent>
              <Info />
            </TabContent>
          </StyledTabPanel>
          <StyledTabPanel value="2">
            <TabContent>
              <Password />
            </TabContent>
          </StyledTabPanel>
          <StyledTabPanel value="3">
            <TabContent>
              <Delete />
            </TabContent>
          </StyledTabPanel>
        </TabContext>
      </Box>
    </Page>
  );
};

export default Profile;
