import axios from "axios";
import { IUser } from "../types/User";

export const getCurrentUser = () => axios.get<IUser>("/user/me");

export const logout = () => axios.delete("/auth/logout");
