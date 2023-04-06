import { User } from "./user.model";
import Login, { RegisterRq } from "./login.model";

export type TokenHeader = {
  Authorization?: string;
};

export type Role = {
  name: string;
};

export type IAuthContext = {
  user: User | null;
  login: (data: Login) => Promise<void>;
  logout: (logoutMessage?: string) => Promise<void>;
  register: (data: RegisterRq) => Promise<void>;
};
