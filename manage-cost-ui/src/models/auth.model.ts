export type TokenHeader = {
  Authorization?: string;
};

export interface User {
  username: string;
  roles: Role[];
}

type Role = {
  name: string;
};
