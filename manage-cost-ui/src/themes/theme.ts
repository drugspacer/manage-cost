import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import type {} from "@mui/x-date-pickers/themeAugmentation";

// A custom theme for this app
const theme = createTheme({
  palette: {
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
  },
});

export default theme;
