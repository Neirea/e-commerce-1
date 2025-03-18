import axios, { type AxiosResponse } from "axios";
import type { TProduct } from "../types/Product";

type TCheckoutBody = {
    items: {
        id: Pick<TProduct, "id">["id"];
        amount: number;
    }[];
};

export const checkout = (
    body: TCheckoutBody,
): Promise<AxiosResponse<{ clientSecret: string }>> =>
    axios.post("/payment/checkout", body);
