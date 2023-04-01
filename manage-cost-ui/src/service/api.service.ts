import { logout, updateLastActivity } from "./auth.service";
import { AxiosResponse, HttpStatusCode } from "axios";

const handleResponse = async <Rs, Rq>(response: AxiosResponse<Rs, Rq>) => {
  if (response.status === HttpStatusCode.Ok) {
    // Update last activity on successful server responses, unless it was a refresh token request.
    // This request is considered a background request and not a user initiated one.
    if (!(response.config.url || "").includes("/refresh-token")) {
      updateLastActivity();
    }
    return response.data;
  } else {
    throw await handleError(response);
  }
};

const handleError = async <Rs, Rq>(response: AxiosResponse<Rs, Rq>) => {
  // throw the json response as an error to get status, code, message, etc.
  const data = response.data;
  console.error(data);
  // Log user out if unexpected unauthorized error happened
  if (
    !(response.config.url || "").includes("/token") &&
    !(response.config.url || "").includes("/refresh-token") &&
    response.status === HttpStatusCode.Unauthorized
  ) {
    await logout("Authorization error. You are being signed out.");
    window.location.href = "/login";
  } else {
    return data;
  }
};

export default handleResponse;
