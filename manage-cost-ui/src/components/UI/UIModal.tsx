import React, { FC, MouseEventHandler, PropsWithChildren } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UIModal: FC<
  PropsWithChildren<{
    title?: string;
    isOpen: boolean;
    onClose: MouseEventHandler<HTMLButtonElement>;
  }>
> = ({ children, title, isOpen, onClose }) => (
  <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
    <Box sx={style}>
      <Stack spacing={3}>
        <Stack justifyContent="space-between" direction="row">
          <Typography id="modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>
        {children}
      </Stack>
    </Box>
  </Modal>
);

export default UIModal;
