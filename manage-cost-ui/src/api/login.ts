import LoginModel, { Register } from "../models/login.model";
import { POSTOptions } from "../constants/request";

export const login = async (data: LoginModel) => {
  POSTOptions.body = JSON.stringify(data);
  await fetch("/login", POSTOptions);
};

export const register = async (data: Register) => {
  POSTOptions.body = JSON.stringify(data);
  await fetch("/register", POSTOptions);
};
