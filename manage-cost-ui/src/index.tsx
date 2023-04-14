import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import theme from "./themes/theme";
import { ThemeProvider } from "@mui/material";
import Auth from "./context/Auth";
import { SnackbarProvider } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "./themes/theme";
import i18n from "./i18n";

const Wrapper: React.FC = () => {
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );
  return (
    <SnackbarProvider dense={isMobile}>
      <Auth>
        <App />
      </Auth>
    </SnackbarProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

i18n.on("initialized", () =>
  root.render(
    <React.StrictMode>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Wrapper />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  )
);
