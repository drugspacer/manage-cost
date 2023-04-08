import axios, {
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
  isAxiosError,
} from "axios";
import ErrorRs, { AxiosRequest, MessageRs } from "../models/api.model";
import { TokenHeader } from "../models/auth.model";
import AuthApiHelper from "./AuthApiHelper";
import i18n from "../i18n";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api";

class ApiService {
  static async request<Rs = undefined, Rq = undefined>({
    url,
    method = "GET",
    headers,
    jwtAuth = true,
    ...rest
  }: AxiosRequest<Rq>) {
    try {
      const response = await axios.request<
        MessageRs<Rs>,
        AxiosResponse<MessageRs<Rs>, Rq>,
        Rq
      >({
        url: url,
        method,
        headers: {
          "Content-Type": "application/json",
          ...ApiService.jwtHeader(jwtAuth),
          ...headers,
        },
        ...rest,
      });
      return ApiService.handleResponse(response);
    } catch (error) {
      console.error(error);
      if (isAxiosError<ErrorRs, Rq>(error)) {
        throw await ApiService.handleError(error);
      }
    }
  }

  private static handleResponse<Rs, Rq>(
    response: AxiosResponse<MessageRs<Rs>, Rq>
  ): Rs {
    console.log(response);
    const data = response.data;
    if (!(response.config.url || "").includes("/refresh-token")) {
      // Update last activity on successful server responses, unless it was a refresh token request.
      // This request is considered a background request and not a user initiated one.
      ApiService.updateLastActivity();
    }
    if (data.message) {
      AuthApiHelper.messageListener.forEach((listener) =>
        listener(data.message!, { variant: "success" })
      );
    }
    return data.data;
  }

  private static async handleError<Rq>(error: AxiosError<ErrorRs, Rq>) {
    // throw the json response as an error to get status, code, message, etc.
    const data = error.response?.data;
    // Log user out if unexpected unauthorized error happened
    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !["/auth/refresh-token", "/auth/token"].includes(error.config?.url ?? "")
    ) {
      await AuthApiHelper.logoutAuth(i18n.t("error.authorization"));
    } else {
      if (data?.message) {
        AuthApiHelper.messageListener.forEach((listener) =>
          listener(data.message, { variant: "error" })
        );
      }
      return data;
    }
  }

  private static jwtHeader(jwtAuth: boolean): TokenHeader {
    const token = localStorage.getItem("token");
    if (jwtAuth && token) {
      return { Authorization: "Bearer " + token };
    }
    return {};
  }

  private static updateLastActivity() {
    localStorage.setItem("lastActivity", new Date().toISOString());
  }
}

export default ApiService;
