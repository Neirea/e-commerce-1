import axios from "axios";
import { IProduct } from "../types/Product";

type ICheckoutBody = {
    items: {
        id: Pick<IProduct, "id">["id"];
        amount: number;
    }[];
    buyer: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
};

export const checkout = (body: ICheckoutBody) =>
    axios.post("/payment/checkout", body);
