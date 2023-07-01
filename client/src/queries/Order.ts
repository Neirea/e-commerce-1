import axios from "axios";
import { IOrderWithItems } from "../types/Order";

export const getAllOrders = () => axios.get<IOrderWithItems[]>("/order");

export const cancelOrder = (id: Pick<IOrderWithItems, "id">["id"]) =>
    axios.patch(`/order/${id}`);

export const deleteOrder = (id: Pick<IOrderWithItems, "id">["id"]) =>
    axios.delete(`/order/${id}`);
