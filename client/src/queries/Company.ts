import axios from "axios";
import type { TCompany } from "../types/Company";

export const getAllCompanies = () => axios.get<TCompany[]>("/company");

export const createCompany = async (input: Omit<TCompany, "id">) =>
    axios.post<void>("/company", input);

export const updateCompany = async (input: TCompany) => {
    const { id, ...data } = input;
    return axios.patch<void>(`/company/${id}`, data);
};

export const deleteCompany = async (id: Pick<TCompany, "id">["id"]) =>
    axios.delete<void>(`/company/${id}`);
