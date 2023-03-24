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
    /*MuiTable: {
      variants: [
        {
          props: { variant: "modal" },
          style: {
            paddingRight: 1,
            paddingLeft: 1,
          },
        },
      ],
    },*/
  },
});

export default theme;
