import axios from "axios";
import type { TUpdateUserParams, TUser } from "../types/User";

export const getCurrentUser = () => axios.get<TUser>("/user/me");

export const logout = () => axios.delete("/auth/logout");

export const updateUser = (input: TUpdateUserParams) =>
    axios.patch("/user/me", input);
