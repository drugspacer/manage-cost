import React, {
  FC,
  PropsWithChildren,
  ReactElement,
  MouseEvent,
  useCallback,
} from "react";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BreadcrumbData, ButtonProp } from "../../models/ui.model";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";
import Footer from "../UI/Footer";

const Page: FC<
  PropsWithChildren<{
    breadcrumbs?: BreadcrumbData[];
    buttons?: ButtonProp[];
    mainButton?: ButtonProp;
    header?: string;
  }>
> = ({ children, buttons = [], mainButton, breadcrumbs = [], header }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const matches = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const menuItemHandler = useCallback(
    (handler: () => void): (() => void) =>
      () => {
        onCloseHandler();
        handler();
      },
    []
  );

  const onCloseHandler = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

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

  const toolbarContent: (ReactElement | null | undefined)[] = [
    <Typography sx={{ flexGrow: 1 }} key="header">
      {breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1].label : header}
    </Typography>,
  ];

  if (matches) {
    toolbarContent.unshift(
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={handleClick}
        key="menuIcon"
      >
        <MenuIcon />
      </IconButton>,
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        key="menu"
      >
        {mainButton && (
          <MenuItem onClick={menuItemHandler(mainButton.handler)}>
            {mainButton.text}
          </MenuItem>
        )}
        {buttons.map((item) => (
          <MenuItem onClick={menuItemHandler(item.handler)} key={item.text}>
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    );
  } else {
    toolbarContent.unshift(...buttons.map(({ element }) => element));
    mainButton &&
      toolbarContent.push(
        <Button
          color="inherit"
          onClick={mainButton.handler}
          key={mainButton.text}
        >
          {mainButton.text}
        </Button>
      );
  }

  return (
    <>
      <AppBar position="static" sx={{ marginBottom: 1 }}>
        <Toolbar>{toolbarContent}</Toolbar>
      </AppBar>
      <Container sx={{ flexGrow: 1 }}>
        <Stack spacing={1} alignItems="center">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            {breadcrumbsContent}
          </Breadcrumbs>
          {children}
        </Stack>
      </Container>
      <Footer />
    </>
  );
};

export default Page;
