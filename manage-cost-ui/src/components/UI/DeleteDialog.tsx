import Dialog from "@mui/material/Dialog";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

const flex = { flex: "1" };

const DeleteDialog: React.FC<{
  open: boolean;
  onClose: (value: boolean) => void;
}> = ({ onClose, open }) => (
  <Dialog onClose={() => onClose(false)} open={open}>
    <DialogTitle sx={{ textAlign: "center" }}>Удалить запись?</DialogTitle>
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

export default DeleteDialog;
