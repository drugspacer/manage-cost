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
    /*MuiPaper: {
      variants: [
        {
          props: { variant: "withPadding" },
          style: ({ theme }) => ({
            padding: `${theme.spacing(3)} ${theme.spacing(5)}`,
          }),
        },
      ],
    },*/
  },
});

theme = responsiveFontSizes(theme);

export default theme;
