import { TokenHeader } from "../models/auth.model";
import LoginModel from "../models/login.model";

const jwtHeader = (jwtAuth: boolean): TokenHeader => {
  const token = localStorage.getItem("token");
  if (jwtAuth && token) {
    return { Authorization: "Bearer " + token };
  }
  return {};
};

export const basicAuthHeader = ({ username, password }: LoginModel) => {
  return {
    Authorization: `Basic ${btoa(
      String.fromCharCode.apply(
        null,
        Array.from(new TextEncoder().encode(`${username}:${password}`))
      )
    )}`,
  };
};

export default jwtHeader;
