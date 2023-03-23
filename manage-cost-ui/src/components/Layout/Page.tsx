import React, {
  FC,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
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

const Page: FC<
  PropsWithChildren<{
    buttons: ButtonProp[];
    breadcrumbs: BreadcrumbData[];
    mainButton?: ButtonProp;
  }>
> = ({ children, buttons, mainButton, breadcrumbs }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    const handleResize = (): void => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

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
    <Typography sx={{ flexGrow: 1 }}>
      {breadcrumbs[breadcrumbs.length - 1].label}
    </Typography>,
  ];

  if (screenWidth < 600) {
    toolbarContent.unshift(
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={handleClick}
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
        <Button color="inherit" onClick={mainButton.handler}>
          {mainButton.text}
        </Button>
      );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>{toolbarContent}</Toolbar>
      </AppBar>
      <Container
        sx={(theme) => ({
          [theme.breakpoints.down("sm")]: {
            paddingRight: 4,
          },
          [theme.breakpoints.up("sm")]: {
            paddingRight: 5,
          },
        })}
      >
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
