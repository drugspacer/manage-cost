import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  HttpStatusCode,
  isAxiosError,
} from "axios";
import ErrorRs, { AxiosRequest, MessageRs } from "../models/api.model";
import { TokenHeader } from "../models/auth.model";
import AuthApiHelper from "./AuthApiHelper";
import i18n from "../i18n";
import { formatISO, parseISO } from "date-fns";
import { isMessageRs, isTripRs } from "../functions/apiTransform";
import Activity from "../models/activity.model";

class ApiService {
  private static axiosInstance: AxiosInstance;

  static {
    const buildAcceptLanguage = (lng = i18n.languages[0]) =>
      `${lng},${
        ["ru", "en"].filter((item) => !i18n.language.includes(item))[0]
      };q=0.5`;

    ApiService.axiosInstance = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
    ApiService.axiosInstance.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = buildAcceptLanguage(i18n.language);
      return config;
    });
    ApiService.axiosInstance.interceptors.request.use((config) => {
      const { data } = config;
      if (data instanceof Object && data.constructor === Object) {
        for (const key in data) {
          // send only data without timezone
          if (data[key] instanceof Date) {
            data[key] = formatISO(data[key], { representation: "date" });
          }
        }
      }
      return config;
    });
    ApiService.axiosInstance.interceptors.response.use(
      (response) => {
        // Check if the response data contains a 'date' property
        console.log(response);
        if (isTripRs(response.data) && response.data.data.activities) {
          response.data = {
            ...response.data,
            data: {
              ...response.data.data,
              activities: response.data.data.activities.map<Activity>(
                (activity) => ({
                  ...activity,
                  date: parseISO(activity.date),
                })
              ),
            },
          };
        }
        console.log(response);
        return response;
      },
      (error) => Promise.reject(error)
    );
    i18n.on("languageChanged", (newLanguage) => {
      ApiService.axiosInstance.defaults.headers.common["Accept-Language"] =
        buildAcceptLanguage(newLanguage);
    });
  }

  static async request<Rs = undefined, Rq = undefined, Outer = false>({
    url,
    method = "GET",
    headers,
    jwtAuth = true,
    ...rest
  }: AxiosRequest<Rq>) {
    type Response = Outer extends true ? Rs : MessageRs<Rs>;
    type Error = Outer extends true ? any : ErrorRs;
    try {
      const response = await ApiService.axiosInstance.request<
        Response,
        AxiosResponse<Response, Rq>,
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
      return ApiService.handleResponse<Response, Rq>(response);
    } catch (error) {
      if (isAxiosError<Error, Rq>(error)) {
        throw await ApiService.handleError<Rq>(error);
      }
    }
  }

  private static handleResponse<Rs, Rq>(
    response: AxiosResponse<Rs, Rq>
  ): Rs extends MessageRs<infer Data> ? Data : Rs {
    const data = response.data;
    if (!(response.config.url || "").includes("/refresh-token")) {
      // Update last activity on successful server responses, unless it was a refresh token request.
      // This request is considered a background request and not a user initiated one.
      ApiService.updateLastActivity();
    }
    if (isMessageRs<Rs extends MessageRs<infer Data> ? Data : Rs>(data)) {
      if (data.message) {
        AuthApiHelper.messageListener.forEach((listener) =>
          listener(data.message!, { variant: "success" })
        );
      }
      return data.data;
    }
    return data as Rs extends MessageRs<infer Data> ? Data : Rs;
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
      if (
        !!data?.message &&
        "/auth/refresh-token" !== error.config?.url &&
        error.response?.status !== HttpStatusCode.UnprocessableEntity
      ) {
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
