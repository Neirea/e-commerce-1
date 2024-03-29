import axios from "axios";
import { IUpdateUserParams, IUser } from "../types/User";

export const getCurrentUser = () => axios.get<IUser>("/user/me");

export const logout = () => axios.delete("/auth/logout");

export const updateUser = (input: IUpdateUserParams) =>
    axios.patch("/user/me", input);
