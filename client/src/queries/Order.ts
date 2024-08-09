import axios from "axios";
import type { TOrderWithItems } from "../types/Order";

export const getAllOrders = () => axios.get<TOrderWithItems[]>("/order");

export const cancelOrder = (id: Pick<TOrderWithItems, "id">["id"]) =>
    axios.patch(`/order/${id}`);

export const deleteOrder = (id: Pick<TOrderWithItems, "id">["id"]) =>
    axios.delete(`/order/${id}`);
