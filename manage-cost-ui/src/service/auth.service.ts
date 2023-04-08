import { isString } from "../functions/assertions";
import LoginModel, { RegisterRq } from "../models/login.model";
import AuthApi from "./api/auth";
import AuthApiHelper from "./AuthApiHelper";
import i18n from "../i18n";

class AuthService {
  static async register(data: RegisterRq) {
    const token = await AuthApi.register(data);
    isString(token);
    localStorage.setItem("token", token);
    return token;
  }

  static async logout(message?: string) {
    try {
      await AuthApi.logout();
    } catch {
      // do nothing if we can't communicate with server during logout
    } finally {
      localStorage.clear();
      if (message) {
        AuthApiHelper.messageListener.forEach((listener) => listener(message));
      }
    }
  }

  static async login(data: LoginModel) {
    const token = await AuthApi.login(data);
    isString(token);
    localStorage.setItem("token", token);
    return token;
  }

  static monitorSession() {
    // Update if server configuration changes this
    const tokenDuration = 30 * 24 * 60 * 60 * 1000;
    const checkSession = async () => {
      if (localStorage.getItem("token")) {
        const lastActivityFromLocalStorage =
          localStorage.getItem("lastActivity");
        const lastActivity = lastActivityFromLocalStorage
          ? new Date(lastActivityFromLocalStorage)
          : new Date();
        console.debug("lastActivity", lastActivity);
        const timeElapsed = new Date().getTime() - lastActivity.getTime();
        console.debug("timeElapsed", timeElapsed);
        const timeLeft = tokenDuration - timeElapsed;
        console.debug("timeLeft", timeLeft);
        if (timeLeft <= 0) {
          await AuthApiHelper.logoutAuth(i18n.t("error.inactivity"));
        } else if (timeLeft <= 24 * 60 * 60 * 1000) {
          // If less than day left, start trying to refresh the token in the background
          console.debug("attempting to acquire new token in the background");
          console.log("monitorSession request");
          await AuthService.requestNewToken(i18n.t("error.authorization"));
        }
      }
    };
    // Check every minute
    return setInterval(() => checkSession(), 24 * 60 * 60 * 1000);
  }

  static async requestNewToken(logoutMessage?: string) {
    try {
      const token = await AuthApi.requestNewToken();
      isString(token);
      localStorage.setItem("token", token);
    } catch (error) {
      if (error instanceof TypeError) {
        console.debug(
          "Server response not received. Failing silently in hopes this was just a network hiccup.",
          error
        );
      } else {
        console.debug("Error happened during token refresh, so signing out.");
        await AuthApiHelper.logoutAuth(logoutMessage);
      }
      throw error;
    }
  }
}

export default AuthService;
