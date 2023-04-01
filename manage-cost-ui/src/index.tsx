import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "./themes/theme";
import { ThemeProvider } from "@mui/material";
import Auth from "./context/Auth";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Auth>
            <App />
          </Auth>
        </LocalizationProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
