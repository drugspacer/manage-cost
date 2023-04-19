import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import Login, { Register } from "../models/login.model";
import { User } from "../models/user.model";
import { isUser } from "../functions/assertions";
import AuthService from "../service/auth.service";
import UserApi from "../service/api/user";
import { IAuthContext } from "../models/auth.model";
import AuthApiHelper from "../service/AuthApiHelper";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

const initialValue: IAuthContext = {
  user: null,
  login: () => new Promise((resolve) => resolve),
  logout: () => new Promise((resolve) => resolve),
  register: () => new Promise((resolve) => resolve),
  setUser: () => {},
};

export const AuthContext = createContext<IAuthContext>(initialValue);

const Auth: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    AuthApiHelper.setLogout(logout);
    AuthApiHelper.addMessageListener("snackbar", enqueueSnackbar);
  }, []);

  useEffect(() => {
    // Attempt to use refresh token cookie to acquire a token
    // User will be directed to login if this fails, otherwise
    // the current user is retrieved from server and set in the
    // application's react context
    AuthService.requestNewToken()
      .then(async () => {
        const user = await UserApi.currentUser();
        isUser(user);
        setUser(user);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Setup session monitoring
  useEffect(() => {
    const interval = AuthService.monitorSession();
    return () => clearInterval(interval);
  }, []);

  const logout = useCallback(async (logoutMessage?: string) => {
    await AuthService.logout(logoutMessage);
    setUser(null);
  }, []);

  const login = useCallback(async (data: Login) => {
    await AuthService.login(data);
    const user = await UserApi.currentUser();
    isUser(user);
    setUser(user);
  }, []);

  const register = useCallback(async (data: Register) => {
    await AuthService.register(data);
    const user = await UserApi.currentUser();
    isUser(user);
    setUser(user);
  }, []);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Auth;
