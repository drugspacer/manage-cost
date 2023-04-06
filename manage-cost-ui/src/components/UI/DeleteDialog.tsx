import Dialog from "@mui/material/Dialog";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

const flex = { flex: "1" };

type DeleteDialogProps = {
  open: boolean;
  onClose: (value: boolean) => void;
  header?: string;
};

const DeleteDialog = ({
  onClose,
  open,
  header = "Удалить запись?",
}: DeleteDialogProps) => {
  console.log("DeleteDialog render");
  return (
    <Dialog onClose={() => onClose(false)} open={open}>
      <DialogTitle sx={{ textAlign: "center" }}>{header}</DialogTitle>
      <DialogActions>
        <Button variant="contained" onClick={() => onClose(true)} sx={flex}>
          Удалить
        </Button>
        <Button variant="outlined" onClick={() => onClose(false)} sx={flex}>
          Отменить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteDialog.muiName = "Dialog";

export default DeleteDialog;
