import React, { useContext, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../../context/Auth";
import PersonsInput from "../input/PersonsInput";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import Person from "../../models/person.model";
import { PersonAutocomplete } from "../../models/form.model";
import { required, validateField } from "../../functions/validation";
import { personsToDataRq } from "../../functions/apiTransform";
import UserApi from "../../service/api/user";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import theme from "../../themes/theme";
import ItemGrid from "../UI/styled/ItemGrid";
import { useTranslation } from "react-i18next";

const Info = () => {
  const { user } = useContext(AuthContext);
  const [persons, setPersons] = useState<(string | Person)[]>(user!.persons);
  const [personsErrors, setPersonsErrors] = useState<string | undefined>(
    undefined
  );
  const [isEdit, setIsEdit] = useState(false);
  const { t: profile } = useTranslation("profile", { keyPrefix: "info" });
  const { t: common } = useTranslation();

  const handleButton = () => {
    if (isEdit) {
      submit().then();
    } else {
      setIsEdit(true);
    }
  };

  const submit = async () => {
    const errors = validateField(persons, [required]);
    if (!!errors) {
      setPersonsErrors(errors);
      return;
    }
    try {
      await UserApi.updateUser({ ...user!, persons: personsToDataRq(persons) });
    } finally {
      setIsEdit(false);
    }
  };

  const onPersonChange: UseAutocompleteProps<
    Person | PersonAutocomplete,
    true,
    false,
    true
  >["onChange"] = (_e, newValue) => {
    const persons = newValue.map((item) => {
      if (typeof item === "string") {
        return item;
      } else if ("title" in item) {
        return item.name;
      }
      return item;
    });
    setPersons(persons);
    if (!!personsErrors) {
      setPersonsErrors(validateField(persons, [required]));
    }
  };

  const inputButton = (
    <IconButton onClick={handleButton}>
      {isEdit ? (
        <Tooltip title={common("button.save")}>
          <SaveOutlinedIcon />
        </Tooltip>
      ) : (
        <Tooltip title={common("button.edit")}>
          <EditOutlinedIcon />
        </Tooltip>
      )}
    </IconButton>
  );

  console.log("Info render");
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
              value={persons}
              onChange={onPersonChange}
              error={personsErrors}
              readonly={!isEdit}
              button={inputButton}
              margin="none"
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ ml: -2 }} />
          </Grid>
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
        </Grid>
      </Typography>
    </Stack>
  );
};

Info.muiName = "Stack";

export default Info;
