import axios, { type AxiosResponse } from "axios";
import type { TCompany } from "../types/Company";

export const getAllCompanies = (): Promise<AxiosResponse<TCompany[]>> =>
    axios.get("/company");

export const createCompany = async (
    input: Omit<TCompany, "id">,
): Promise<AxiosResponse<void>> => axios.post("/company", input);

export const updateCompany = async (
    input: TCompany,
): Promise<AxiosResponse<void>> => {
    const { id, ...data } = input;
    return axios.patch(`/company/${id}`, data);
};

export const deleteCompany = async (
    id: Pick<TCompany, "id">["id"],
): Promise<AxiosResponse<void>> => axios.delete(`/company/${id}`);
