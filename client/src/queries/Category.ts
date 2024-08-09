import axios from "axios";
import type { TCategory, TUploadedImage } from "../types/Category";

export const getAllCategories = () => axios.get<TCategory[]>("/category");

export const createCategory = async (input: Omit<TCategory, "id">) =>
    axios.post<void>("/category", input);

export const updateCategory = async (input: TCategory) => {
    const { id, ...data } = input;
    return axios.patch<void>(`/category/${id}`, { ...data });
};

export const deleteCategory = async (id: Pick<TCategory, "id">["id"]) =>
    axios.delete<void>(`/category/${id}`);

export const uploadImage = async (formData: FormData) =>
    axios.post<{ image: TUploadedImage }>("/editor/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
