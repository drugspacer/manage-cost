import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import type {} from "@mui/x-date-pickers/themeAugmentation";

// A custom theme for this app
const theme = createTheme({
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

export default theme;
