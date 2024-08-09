import axios from "axios";
import type { TProduct } from "../types/Product";

type TCheckoutBody = {
    items: {
        id: Pick<TProduct, "id">["id"];
        amount: number;
    }[];
    buyer: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
};

export const checkout = (body: TCheckoutBody) =>
    axios.post("/payment/checkout", body);
