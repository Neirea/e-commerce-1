import axios, { type AxiosResponse } from "axios";
import type { TCategory, TUploadedImage } from "../types/Category";

export const getAllCategories = (): Promise<AxiosResponse<TCategory[], any>> =>
    axios.get("/category");

export const createCategory = async (
    input: Omit<TCategory, "id">,
): Promise<AxiosResponse<void>> => axios.post("/category", input);

export const updateCategory = async (
    input: TCategory,
): Promise<AxiosResponse<void>> => {
    const { id, ...data } = input;
    return axios.patch(`/category/${id}`, { ...data });
};

export const deleteCategory = async (
    id: Pick<TCategory, "id">["id"],
): Promise<AxiosResponse<void>> => axios.delete(`/category/${id}`);

export const uploadImage = async (
    formData: FormData,
): Promise<
    AxiosResponse<{
        image: TUploadedImage;
    }>
> =>
    axios.post("/editor/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
