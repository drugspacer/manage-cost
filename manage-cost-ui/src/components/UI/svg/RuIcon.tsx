import React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

const RuIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 9 6">
      <rect fill="#fff" width="9" height="3" />
      <rect fill="#d52b1e" y="3" width="9" height="3" />
      <rect fill="#0039a6" y="2" width="9" height="2" />
    </SvgIcon>
  );
};

export default RuIcon;
