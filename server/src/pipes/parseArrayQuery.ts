import { ParseArrayPipe } from "@nestjs/common";

export const parseArrayQuery = new ParseArrayPipe({
    optional: true,
    items: Number,
    separator: ",",
});
