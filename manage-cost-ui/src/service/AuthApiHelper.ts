import { IAuthContext } from "../models/auth.model";
import { EnqueueSnackbar } from "notistack";

abstract class AuthApiHelper {
  private static _messageListener: Map<string, EnqueueSnackbar> = new Map();
  private static _logout: IAuthContext["logout"];

  static get messageListener() {
    return AuthApiHelper._messageListener;
  }

  static addMessageListener(name: string, listener: EnqueueSnackbar) {
    AuthApiHelper._messageListener.set(name, listener);
  }

  static removeMessageListener(name: string) {
    AuthApiHelper._messageListener.delete(name);
  }

  static get logoutAuth() {
    return AuthApiHelper._logout;
  }

  static setLogout(logout: IAuthContext["logout"]) {
    AuthApiHelper._logout = logout;
  }
}

export default AuthApiHelper;
