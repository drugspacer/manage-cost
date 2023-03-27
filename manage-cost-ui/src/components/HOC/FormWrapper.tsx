import React, { DOMAttributes, FC, PropsWithChildren, ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const FormWrapper: FC<
  PropsWithChildren<
    Pick<DOMAttributes<HTMLFormElement>, "onSubmit"> & {
      submitText: string;
      additionalNode?: ReactNode;
    }
  >
> = ({ children, onSubmit, submitText, additionalNode }) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        {children}
        <Button variant="contained" type="submit">
          {submitText}
        </Button>
        {additionalNode}
      </Stack>
    </form>
  );
};

export default FormWrapper;
