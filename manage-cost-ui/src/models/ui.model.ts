import { ReactElement } from "react";

export type ButtonProp = {
  text: string;
  handler: () => void;
  element?: ReactElement;
};
