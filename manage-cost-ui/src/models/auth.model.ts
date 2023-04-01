import { Id } from "./model";

export type TokenHeader = {
  Authorization?: string;
};

export interface User extends Id {
  username: string;
  roles: Role[];
}

type Role = {
  name: string;
};
