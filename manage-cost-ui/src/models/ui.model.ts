import { ReactElement } from "react";
import { AlertColor } from "@mui/material/Alert/Alert";
import Person from "./person.model";
import Activity from "./activity.model";
import { ActivityFormRq } from "./form.model";

export type BreadcrumbData = {
  href: string;
  label: string;
};

export type ButtonProp = {
  text: string;
  handler: () => void;
  element?: ReactElement;
};

export type SnackbarProps = {
  onShowMessage: (data: string, severity?: AlertColor) => void;
};

export type SaveActionProps = {
  persons: Person[];
  activity?: Activity;
  onSubmit: (data: ActivityFormRq) => void;
};
