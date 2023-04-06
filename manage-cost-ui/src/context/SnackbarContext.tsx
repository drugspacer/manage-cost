import React, {
  createContext,
  FC,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import { AlertColor } from "@mui/material/Alert/Alert";
import MuiSnackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type ISnackbarContext = {
  onShowMessage: (data: string, severity?: AlertColor) => void;
};

const initialValue: ISnackbarContext = {
  onShowMessage: () => {},
};

export const SnackbarContext = createContext<ISnackbarContext>(initialValue);

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Snackbar: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<
    Partial<Record<AlertColor, string>> | undefined
  >(undefined);

  const showMessageHandler: (data: string, severity?: AlertColor) => void =
    useCallback((data, severity = "error") => {
      console.log(severity);
      console.log(data);
      setState({ [severity]: data });
    }, []);

  /*  useEffect(() => {
    AuthApiHelper.addMessageListener("snackbar", showMessageHandler);
    return () => AuthApiHelper.removeMessageListener("snackbar");
  }, [showMessageHandler]);*/

  const handleCloseSnackbar = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setState(undefined);
    },
    []
  );
  console.log("Snackbar render");

  return (
    <SnackbarContext.Provider value={{ onShowMessage: showMessageHandler }}>
      {children}
      {state && (
        <MuiSnackbar
          open={!!state}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={Object.keys(state!)[0] as AlertColor}
            sx={{ width: "100%" }}
          >
            {Object.values(state!)[0]}
          </Alert>
        </MuiSnackbar>
      )}
    </SnackbarContext.Provider>
  );
};

export default Snackbar;
