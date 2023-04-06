import React, { MouseEventHandler, PropsWithChildren } from "react";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ModalContainer from "./styled/ModalContainer";

const UIModal = ({
  children,
  title,
  isOpen,
  onClose,
}: PropsWithChildren<{
  title?: string;
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
}>) => {
  console.log("UIModal render");
  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <ModalContainer>
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
      </ModalContainer>
    </Modal>
  );
};

UIModal.muiName = "Modal";

export default UIModal;
