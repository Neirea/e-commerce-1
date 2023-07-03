import axios from "axios";
import { ICategory, IUploadedImage } from "../types/Category";

export const getAllCategories = () => axios.get<ICategory[]>("/category");

export const createCategory = async (input: Omit<ICategory, "id">) =>
    axios.post<void>("/category", input);

export const updateCategory = async (input: ICategory) => {
    const { id, ...data } = input;
    return axios.patch<void>(`/category/${id}`, { ...data });
};

export const deleteCategory = async (id: Pick<ICategory, "id">["id"]) =>
    axios.delete<void>(`/category/${id}`);

export const uploadImage = async (formData: FormData) =>
    axios.post<{ image: IUploadedImage }>("/editor/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
