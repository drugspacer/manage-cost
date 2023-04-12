import Dialog from "@mui/material/Dialog";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { useTranslation } from "react-i18next";

const flex = { flex: "1" };

type DeleteDialogProps = {
  open: boolean;
  onClose: (value: boolean) => void;
  header: string;
};

const DeleteDialog = ({ onClose, open, header }: DeleteDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={() => onClose(false)} open={open}>
      <DialogTitle sx={{ textAlign: "center" }}>{header}</DialogTitle>
      <DialogActions>
        <Button variant="contained" onClick={() => onClose(true)} sx={flex}>
          {t("button.delete")}
        </Button>
        <Button variant="outlined" onClick={() => onClose(false)} sx={flex}>
          {t("button.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteDialog.muiName = "Dialog";

export default DeleteDialog;
