import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { LinkProps } from "@mui/material/Link";
import LinkBehavior from "./LinkBehaviour";

// A custom theme for this app
let theme = createTheme({
  typography: {
    bold: {
      fontWeight: "bold",
    },
  },
  palette: {
    background: {
      default: "#bdbdbd",
    },
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: "red",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          flexShrink: 0,
          [theme.breakpoints.up("sm")]: {
            paddingTop: theme.spacing(2),
          },
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          gap: theme.spacing(2),
        }),
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          return ownerState.type === "submit"
            ? {
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(1),
              }
            : {};
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          left: "calc(50% - 20px)",
          top: "calc(50% - 20px)",
          position: "fixed",
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiMobileStepper: {
      styleOverrides: {
        root: ({ theme }) => ({
          margin: "auto",
          background: theme.palette.background.paper,
          [theme.breakpoints.up("sm")]: {
            width: "fit-content",
          },
          [theme.breakpoints.down("sm")]: {
            paddingBottom: "0px",
          },
        }),
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
