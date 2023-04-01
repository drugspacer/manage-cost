import LoginModel, { RegisterRq } from "../models/login.model";
import axiosApi from "./axios";
import { basicAuthHeader } from "../service/auth-header";

export const login = (data: LoginModel) =>
  axiosApi<string, LoginModel>({
    url: "/auth/token",
    method: "POST",
    headers: basicAuthHeader(data),
    jwtAuth: false,
  });

export const requestNewToken = () =>
  axiosApi<string>({ url: "/auth/refresh-token", method: "POST" });

export const logout = () =>
  axiosApi({ url: "/auth/token", method: "DELETE", jwtAuth: false });

export const register = (data: RegisterRq) =>
  axiosApi<string, RegisterRq>({
    url: "/auth/register",
    method: "POST",
    data,
    jwtAuth: false,
  });
