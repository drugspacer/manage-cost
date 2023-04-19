import React, {
  FormEventHandler,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type FromWrapperProps = PropsWithChildren<{
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitText: string;
  additionalNode?: ReactNode;
}>;

const FormWrapper = ({
  children,
  onSubmit,
  submitText,
  additionalNode,
}: FromWrapperProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      setIsSubmitting(true);
      try {
        await onSubmit(event);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  return (
    <form onSubmit={submitHandler}>
      <Stack>
        {children}
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {submitText}
        </Button>
        {additionalNode}
      </Stack>
    </form>
  );
};

FormWrapper.muiName = "Stack";

export default FormWrapper;
