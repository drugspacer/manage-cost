import React, { FC, useState } from "react";
import Page from "../components/Layout/Page";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "../components/UI/Tabs";
import { useNavigate } from "react-router";

const Profile: FC = () => {
  const [value, setValue] = useState("1");
  const navigate = useNavigate();

  return (
    <Page
      header="Профиль"
      buttons={[{ text: "Назад", handler: () => navigate("/") }]}
    >
      <Box sx={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
        <TabContext value={value}>
          <Tabs onChange={(_e, newValue) => setValue(newValue)}>
            <Tab label="Информация" value="1" />
            <Tab label="Пароль" value="2" />
            <Tab label="Удаление" value="3" />
          </Tabs>
          <TabPanel value="1">Информация о пользователе</TabPanel>
          <TabPanel value="2">Поменять пароль</TabPanel>
          <TabPanel value="3">
            Удалить аккаунт и все связанные с ним поездки?
          </TabPanel>
        </TabContext>
      </Box>
    </Page>
  );
};

export default Profile;
