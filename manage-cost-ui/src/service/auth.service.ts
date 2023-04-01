import LoginModel, { RegisterRq } from "../models/login.model";
import * as api from "../api/auth";

export const login = async (data: LoginModel) => {
  const token = await api.login(data);
  localStorage.setItem("token", token);
  return token;
};

export const logout = async (message?: string) => {
  try {
    await api.logout();
  } catch (error) {
    // do nothing if we can't communicate with server during logout
  } finally {
    localStorage.clear();
    if (!["/login", "/register"].includes(window.location.pathname)) {
      window.location.href = "/login?signOut=true";
    }
    if (message) {
      alert(message);
    }
  }
};

export const register = async (data: RegisterRq) => {
  const token = await api.register(data);
  localStorage.setItem("token", token);
  return token;
};

export const monitorSession = () => {
  // Update if server configuration changes this
  const tokenDuration = 30 * 24 * 60 * 60 * 1000;
  const checkSession = async () => {
    if (localStorage.getItem("token")) {
      const lastActivityFromLocalStorage = localStorage.getItem("lastActivity");
      const lastActivity = lastActivityFromLocalStorage
        ? new Date(lastActivityFromLocalStorage)
        : new Date();
      console.debug("lastActivity", lastActivity);
      const timeElapsed = new Date().getTime() - lastActivity.getTime();
      console.debug("timeElapsed", timeElapsed);
      const timeLeft = tokenDuration - timeElapsed;
      console.debug("timeLeft", timeLeft);
      if (timeLeft <= 0) {
        await logout("You have been logged out from inactivity.");
      } else if (timeLeft <= 24 * 60 * 60 * 1000) {
        // If less than day left, start trying to refresh the token in the background
        try {
          console.debug("attempting to acquire new token in the background");
          await requestNewToken();
        } catch (error) {
          if (error instanceof TypeError) {
            console.debug(
              "Server response not received. Failing silently in hopes this was just a network hiccup.",
              error
            );
          } else {
            console.debug(
              "Error happened during token refresh, so signing out."
            );
            await logout("Authorization error. You are being signed out.");
          }
        }
      }
    }
  };
  // Check every minute
  return setInterval(() => checkSession(), 24 * 60 * 60 * 1000);
};

export const requestNewToken = async () =>
  localStorage.setItem("token", await api.requestNewToken());

export const updateLastActivity = (): void => {
  localStorage.setItem("lastActivity", new Date().toISOString());
};
