import { Order } from "@prisma/client";

export type OrderId = Pick<Order, "id">["id"];
