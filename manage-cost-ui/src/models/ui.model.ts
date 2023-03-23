import { DOMAttributes, ReactElement } from "react";

export type BreadcrumbData = {
  href: string;
  label: string;
};

export type ButtonProp = {
  text: string;
  handler: DOMAttributes<HTMLButtonElement | HTMLLIElement>["onClick"];
  element?: ReactElement;
};
