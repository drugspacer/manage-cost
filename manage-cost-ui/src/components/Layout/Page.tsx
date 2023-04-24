import React, {
  FC,
  PropsWithChildren,
  ReactElement,
  MouseEvent,
  useCallback,
  useContext,
  useState,
  useMemo,
  memo,
} from "react";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ButtonProp } from "../../models/ui.model";
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
import { AuthContext } from "../../context/Auth";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../input/LanguageSwitcher";

type MenuElement = {
  basicMenu?: HTMLElement;
  profile?: HTMLElement;
};

type BreadcrumbData = {
  href: string;
  label: string;
};

const Page: FC<
  PropsWithChildren<{
    breadcrumbs?: BreadcrumbData[];
    buttons?: ButtonProp[];
    mainButton?: ButtonProp;
    header?: string;
  }>
> = ({ children, buttons = [], mainButton, breadcrumbs, header }) => {
  const [anchorEl, setAnchorEl] = useState<MenuElement>({});
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleOpenClick = useCallback(
    ({ currentTarget }: MouseEvent<HTMLButtonElement>): void => {
      setAnchorEl((prevState) => ({
        ...prevState,
        [currentTarget.name]: currentTarget,
      }));
    },
    []
  );

  const onCloseHandler = useCallback(
    (name: keyof MenuElement) =>
      setAnchorEl((prevState) => ({
        ...prevState,
        [name]: undefined,
      })),
    []
  );

  const menuItemHandler = useCallback(
    (handler: () => void, name: keyof MenuElement): (() => void) =>
      () => {
        onCloseHandler(name);
        handler();
      },
    [onCloseHandler]
  );

  const breadcrumbsContent = useMemo(
    () =>
      breadcrumbs?.map((item, index, self) => {
        if (self.length === index + 1) {
          return (
            <Typography key={item.href} color="text.primary">
              {item.label}
            </Typography>
          );
        }
        return (
          <Link key={item.href} color="inherit" href={item.href}>
            {item.label}
          </Link>
        );
      }),
    [breadcrumbs]
  );

  const toolbarContent: ReactElement[] = useMemo(() => {
    const toolbarContent = [
      <Typography sx={{ flexGrow: 1 }} key="header">
        {breadcrumbs?.length
          ? breadcrumbs[breadcrumbs.length - 1].label
          : header}
      </Typography>,
    ];
    if (isMobile) {
      toolbarContent.unshift(
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label={t("ariaLabel.menu")}
          onClick={handleOpenClick}
          name="basicMenu"
          key="menuIcon"
        >
          <MenuIcon />
        </IconButton>,
        <Menu
          id="basicMenu"
          anchorEl={anchorEl.basicMenu}
          open={!!anchorEl.basicMenu}
          onClose={() => onCloseHandler("basicMenu")}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          key="menu"
        >
          {mainButton && (
            <MenuItem
              onClick={menuItemHandler(mainButton.handler, "basicMenu")}
            >
              {mainButton.text}
            </MenuItem>
          )}
          {buttons.map((item) => (
            <MenuItem
              onClick={menuItemHandler(item.handler, "basicMenu")}
              key={item.text}
            >
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      );
    } else {
      toolbarContent.unshift(...buttons.map(({ element }) => element!));
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
    toolbarContent.push(
      <IconButton
        size="large"
        aria-label={t("ariaLabel.profile")}
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenClick}
        color="inherit"
        key="profile-icon"
        name="profile"
      >
        {!!user ? <AccountCircle /> : <MenuIcon />}
      </IconButton>,
      <Menu
        id="profile"
        anchorEl={anchorEl.profile}
        keepMounted
        open={!!anchorEl.profile}
        onClose={() => onCloseHandler("profile")}
        key="profile-menu"
      >
        {!!user && (
          <MenuItem
            onClick={menuItemHandler(() => navigate(`/profile`), "profile")}
          >
            {t("button.profile")}
          </MenuItem>
        )}
        {!!user && (
          <MenuItem onClick={menuItemHandler(logout, "profile")}>
            {t("button.logout")}
          </MenuItem>
        )}
        <MenuItem
          onClick={menuItemHandler(() => navigate("/about"), "profile")}
        >
          {t("button.about")}
        </MenuItem>
        <MenuItem sx={{ justifyContent: "center" }}>
          <LanguageSwitcher onClose={() => onCloseHandler("profile")} />
        </MenuItem>
      </Menu>
    );
    return toolbarContent;
  }, [
    isMobile,
    mainButton,
    buttons,
    handleOpenClick,
    anchorEl,
    breadcrumbs,
    header,
    onCloseHandler,
    menuItemHandler,
    t,
  ]);

  return (
    <>
      <AppBar position="fixed" sx={{ marginBottom: 1 }}>
        <Toolbar>{toolbarContent}</Toolbar>
      </AppBar>
      <Container sx={{ flexGrow: 1, mt: "76px", mb: 2 }}>
        <Stack spacing={1} alignItems="center">
          {breadcrumbsContent && (
            <Breadcrumbs
              aria-label={t("ariaLabel.breadcrumb")}
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{ zIndex: 10 }}
            >
              {breadcrumbsContent}
            </Breadcrumbs>
          )}
          {children}
        </Stack>
      </Container>
      <Footer />
    </>
  );
};

export default memo(Page);
