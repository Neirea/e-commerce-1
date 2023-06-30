import axios from "axios";
import { ICompany } from "../types/Company";

export const getAllCompanies = () => axios.get<ICompany[]>("/company");

export const createCompany = async (input: Omit<ICompany, "id">) =>
    axios.post<void>("/company", input);

export const updateCompany = async (input: ICompany) => {
    const { id, ...data } = input;
    return axios.patch<void>(`/company/${id}`, data);
};

export const deleteCompany = async (id: Pick<ICompany, "id">["id"]) =>
    axios.delete<void>(`/company/${id}`);
