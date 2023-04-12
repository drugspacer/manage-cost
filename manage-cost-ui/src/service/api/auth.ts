import LoginModel, { RegisterRq } from "../../models/login.model";
import ApiService from "../api.service";

class AuthApi {
  static login(data: LoginModel) {
    return ApiService.request<string, LoginModel>({
      url: "/auth/token",
      method: "POST",
      headers: AuthApi.basicAuthHeader(data),
      jwtAuth: false,
    });
  }

  static requestNewToken() {
    return ApiService.request<string>({
      url: "/auth/refresh-token",
      method: "POST",
    });
  }

  static logout() {
    return ApiService.request({
      url: "/auth/token",
      method: "DELETE",
      jwtAuth: false,
    });
  }

  static register(data: RegisterRq) {
    return ApiService.request<string, RegisterRq>({
      url: "/auth/register",
      method: "POST",
      data,
      jwtAuth: false,
    });
  }

  private static basicAuthHeader({ username, password }: LoginModel) {
    return {
      Authorization: `Basic ${btoa(
        String.fromCharCode.apply(
          null,
          Array.from(new TextEncoder().encode(`${username}:${password}`))
        )
      )}`,
    };
  }
}

export default AuthApi;
