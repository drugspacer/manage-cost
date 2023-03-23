import React, {
  Children,
  cloneElement,
  FC,
  memo,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import DeleteDialog from "../UI/DeleteDialog";

const DialogWrapper: FC<PropsWithChildren<{ onDelete: () => void }>> = ({
  children,
  onDelete,
}) => {
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
      <DeleteDialog open={open} onClose={handleClose} />
    </>
  );
};

export default memo(DialogWrapper);
