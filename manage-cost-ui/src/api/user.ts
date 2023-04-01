import axiosApi from "./axios";
import { User } from "../models/auth.model";

export const currentUser = () => axiosApi<User>({ url: `/users/current-user` });
