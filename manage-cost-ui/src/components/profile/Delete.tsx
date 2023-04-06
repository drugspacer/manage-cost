import React, { FC, MouseEventHandler, useContext, useState } from "react";
import DeleteDialogWrapper from "../HOC/DeleteDialogWrapper";
import UserApi from "../../service/api/user";
import { AuthContext } from "../../context/Auth";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const DeleteContent: FC<{
  isLoading: boolean;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
}> = ({ isLoading, onDelete }) => (
  <Stack spacing={2}>
    <Typography variant="h6">Удаление аккаунта</Typography>
    {isLoading ? (
      <CircularProgress />
    ) : (
      <Button variant="contained" onClick={onDelete}>
        Удалить аккаунт
      </Button>
    )}
  </Stack>
);

const Delete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const deleteHandler = async () => {
    setIsLoading(true);
    try {
      await UserApi.deleteUser(user!.id);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Delete render");
  return (
    <DeleteDialogWrapper
      onDelete={deleteHandler}
      header="Удалить аккаунт и все связанные с ним данные?"
    >
      <DeleteContent isLoading={isLoading} />
    </DeleteDialogWrapper>
  );
};

Delete.muiName = "Stack";

export default Delete;
