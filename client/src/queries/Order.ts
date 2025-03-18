import axios, { type AxiosResponse } from "axios";
import type { TOrderWithItems } from "../types/Order";

export const getAllOrders = (): Promise<AxiosResponse<TOrderWithItems[]>> =>
    axios.get("/order");

export const cancelOrder = (
    id: Pick<TOrderWithItems, "id">["id"],
): Promise<AxiosResponse<void>> => axios.patch(`/order/${id}`);

export const deleteOrder = (
    id: Pick<TOrderWithItems, "id">["id"],
): Promise<AxiosResponse<void>> => axios.delete(`/order/${id}`);
