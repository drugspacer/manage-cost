import { PasswordRq, User } from "../../models/user.model";
import ApiService from "../api.service";
import { UserRq } from "../../models/form.model";

class UserApi {
  static currentUser() {
    return ApiService.request<User>({ url: `/users/current-user` });
  }

  static changePassword(data: PasswordRq) {
    return ApiService.request<undefined, PasswordRq>({
      url: `/users/change-password`,
      method: "POST",
      data,
    });
  }

  static deleteCurrentUser() {
    return ApiService.request({
      url: `/users/current-user`,
      method: "DELETE",
    });
  }

  static deleteUser(id: string) {
    return ApiService.request({ url: `/users/${id}`, method: "DELETE" });
  }

  static updateCurrentUser(data: UserRq) {
    return ApiService.request<User, UserRq>({
      url: "/users/current-user",
      method: "PUT",
      data,
    });
  }
}

export default UserApi;
