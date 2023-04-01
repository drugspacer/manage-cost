import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import authHeader from "../service/auth-header";
import handleResponse from "../service/api.service";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api";

const axiosApi = async <Rs = undefined, Rq = undefined>({
  url,
  method = "GET",
  headers,
  jwtAuth = true,
  handler,
  ...rest
}: AxiosRequestConfig<Rq> & {
  jwtAuth?: boolean;
  handler?: (response: AxiosResponse<Rs, Rq>) => Promise<Rs>;
}) => {
  const response = await axios.request<Rs, AxiosResponse<Rs, Rq>, Rq>({
    url: url,
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(jwtAuth),
      ...headers,
    },
    ...rest,
  });
  return handler ? handler(response) : handleResponse(response);
};
export default axiosApi;
