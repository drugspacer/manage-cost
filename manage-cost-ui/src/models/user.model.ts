import { Id } from "./model";
import { Role } from "./auth.model";
import Person from "./person.model";

export interface User extends Id {
  username: string;
  roles: Role[];
  persons: Person[];
}

export type PasswordRq = {
  oldPassword: string;
  password: string;
};
