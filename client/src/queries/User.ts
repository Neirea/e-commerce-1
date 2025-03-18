import axios, { type AxiosResponse } from "axios";
import type { TUpdateUserParams, TUser } from "../types/User";

export const getCurrentUser = (): Promise<AxiosResponse<TUser>> =>
    axios.get("/user/me");

export const logout = (): Promise<AxiosResponse<void, any>> =>
    axios.delete("/auth/logout");

export const updateUser = (
    input: TUpdateUserParams,
): Promise<AxiosResponse<void, any>> => axios.patch("/user/me", input);
