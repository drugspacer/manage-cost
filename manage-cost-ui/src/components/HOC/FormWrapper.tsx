import React, { DOMAttributes, FC, PropsWithChildren } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const FormWrapper: FC<
  PropsWithChildren<
    Pick<DOMAttributes<HTMLFormElement>, "onSubmit"> & { submitText: string }
  >
> = ({ children, onSubmit, submitText }) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        {children}
        <Button variant="contained" type="submit">
          {submitText}
        </Button>
      </Stack>
    </form>
  );
};

export default FormWrapper;
