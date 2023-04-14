import React, { useContext, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../../context/Auth";
import PersonsInput from "../input/PersonsInput";
import { personsToDataRq } from "../../functions/apiTransform";
import UserApi from "../../service/api/user";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import theme from "../../themes/theme";
import ItemGrid from "../UI/styled/ItemGrid";
import { useTranslation } from "react-i18next";
import UIModal from "../UI/UIModal";
import Persons from "../forms/Persons";
import Person from "../../models/person.model";
import { isUser } from "../../functions/assertions";

const Info = () => {
  const { user, setUser } = useContext(AuthContext);
  const { t: profile } = useTranslation("profile", { keyPrefix: "info" });
  const { t: common } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const submitHandler = async (persons: (string | Person)[]) => {
    try {
      const userRs = await UserApi.updateCurrentUser({
        ...user!,
        persons: personsToDataRq(persons),
      });
      isUser(userRs);
      setUser(userRs);
    } finally {
      setModalOpen(false);
    }
  };

  const inputButton = (
    <IconButton onClick={() => setModalOpen(true)}>
      <Tooltip title={common("button.edit")}>
        <EditOutlinedIcon />
      </Tooltip>
    </IconButton>
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ paddingLeft: theme.spacing(2) }}>
        {profile("header")}
      </Typography>
      <Typography variant="body2" component="div" sx={{ paddingLeft: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <ItemGrid item flexBasis="118px">
            <Typography variant="bold">{profile("username")}</Typography>
          </ItemGrid>
          <Grid item xs>
            {user!.username}
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ ml: -2 }} />
          </Grid>
          <ItemGrid item flexBasis="118px" isFullMobile>
            <Typography variant="bold">{profile("participants")}</Typography>
          </ItemGrid>
          <Grid item xs={12} sm>
            <PersonsInput
              value={user!.persons}
              readonly
              button={inputButton}
              margin="none"
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ ml: -2 }} />
          </Grid>
          {process.env.NODE_ENV === "development" && (
            <>
              <ItemGrid item flexBasis="118px">
                <Typography variant="bold">{profile("roles")}</Typography>
              </ItemGrid>
              <Grid item xs>
                <Typography>
                  {user!.roles.map((role) => role.name).join(", ")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ ml: -2 }} />
              </Grid>
            </>
          )}
        </Grid>
      </Typography>
      <UIModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={common("input.participant")}
      >
        <Persons onSubmit={submitHandler} />
      </UIModal>
    </Stack>
  );
};

Info.muiName = "Stack";

export default Info;
