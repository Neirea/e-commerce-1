import { ParseArrayPipe } from "@nestjs/common";

export const parseArrayQuery = new ParseArrayPipe({
    items: Number,
    separator: ",",
});
