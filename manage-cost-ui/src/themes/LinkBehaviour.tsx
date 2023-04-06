import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import React from "react";

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>(({ href, ...other }, ref) => {
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

export default LinkBehavior;
