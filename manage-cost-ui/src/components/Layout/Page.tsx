import React, { FC, PropsWithChildren, ReactElement } from "react";
import AppBarHeader from "./AppBarHeader";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BreadcrumbData } from "../../models/ui.model";

const Page: FC<
  PropsWithChildren<{ buttons: ReactElement[]; breadcrumbs: BreadcrumbData[] }>
> = ({ children, buttons, breadcrumbs }) => {
  const breadcrumbsContent = breadcrumbs.map((item, index, self) => {
    if (self.length === index + 1) {
      return (
        <Typography key={item.href} color="text.primary">
          {item.label}
        </Typography>
      );
    }
    return (
      <Link key={item.href} underline="hover" color="inherit" href={item.href}>
        {item.label}
      </Link>
    );
  });

  return (
    <>
      <AppBarHeader>
        <Stack spacing={2} direction="row" alignItems="center">
          {buttons}
          <Typography>{breadcrumbs[breadcrumbs.length - 1].label}</Typography>
        </Stack>
      </AppBarHeader>
      <Container>
        <Stack spacing={2} alignItems="center">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            {breadcrumbsContent}
          </Breadcrumbs>
          {children}
        </Stack>
      </Container>
    </>
  );
};

export default Page;
