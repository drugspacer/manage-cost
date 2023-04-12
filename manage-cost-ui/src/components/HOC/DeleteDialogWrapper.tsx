import React, {
  Children,
  cloneElement,
  FC,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import DeleteDialog from "../UI/DeleteDialog";

const DeleteDialogWrapper: FC<
  PropsWithChildren<{ onDelete: () => void; header: string }>
> = ({ children, onDelete, header }) => {
  const [open, setOpen] = useState(false);

  const handleClose = (value: boolean): void => {
    if (value) {
      onDelete();
    }
    setOpen(false);
  };

  const deleteHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.stopPropagation();
      setOpen(true);
    },
    []
  );

  return (
    <>
      {Children.map(children, (child) => {
        return child && typeof child === "object" && "type" in child
          ? cloneElement(child, { onDelete: deleteHandler })
          : child;
      })}
      <DeleteDialog open={open} onClose={handleClose} header={header} />
    </>
  );
};

export default DeleteDialogWrapper;
