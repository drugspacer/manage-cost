import { ReactElement } from "react";

export type BreadcrumbData = {
  href: string;
  label: string;
};

export type ButtonProp = {
  text: string;
  handler: () => void;
  element?: ReactElement;
};
