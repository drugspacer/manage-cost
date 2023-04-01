import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import * as AuthService from "../service/auth.service";
import { User } from "../models/auth.model";
import Login, { RegisterRq } from "../models/login.model";
import { currentUser } from "../api/user";
import { monitorSession } from "../service/auth.service";

type IAuthContext = {
  user: User | null;
  login: (data: Login) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRq) => Promise<void>;
  isLoading: boolean;
};

const initialValue: IAuthContext = {
  user: null,
  login: () => new Promise((resolve) => resolve),
  logout: () => new Promise((resolve) => resolve),
  register: () => new Promise((resolve) => resolve),
  isLoading: true,
};

export const AuthContext = createContext<IAuthContext>(initialValue);

const Auth: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.get("signOut")) {
      setIsLoading(false);
    } else {
      // Attempt to use refresh token cookie to acquire a token
      // User will be directed to login if this fails, otherwise
      // the current user is retrieved from server and set in the
      // application's react context
      AuthService.requestNewToken()
        .then(async () => {
          setUser(await currentUser());
          setIsLoading(false);
        })
        .catch(async () => {
          await AuthService.logout();
          setIsLoading(false);
        });
    }
    currentUser().then((user) => setUser(user));
  }, []);

  // Setup session monitoring
  useEffect(() => {
    const interval = monitorSession();
    return () => clearInterval(interval);
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  const login = useCallback(async (data: Login) => {
    await AuthService.login(data);
    setUser(await currentUser());
  }, []);

  const register = useCallback(async (data: RegisterRq) => {
    await AuthService.register(data);
    setUser(await currentUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default Auth;
