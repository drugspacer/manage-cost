import React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

const EnIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 50 30">
      <clipPath id="t">
        <path d="M25,15h25v15zv15h-25zh-25v-15zv-15h25z" />
      </clipPath>
      <path d="M0,0v30h50v-30z" fill="#012169" />
      <path d="M0,0 50,30M50,0 0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 50,30M50,0 0,30"
        clipPath="url(#t)"
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path
        d="M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z"
        fill="#c8102e"
        stroke="#fff"
        strokeWidth="2"
      />
    </SvgIcon>
  );
};

export default EnIcon;
