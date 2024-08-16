import { z } from "zod";

export const phoneDesc =
    '"+" for country code; you can use "()","-" for the remaining number';
export const phoneRegex = /(\+)[1-9][0-9 \-\(\)]{7,32}/;

export const phoneZod = z.string().regex(phoneRegex).or(z.string().length(0));
export const emailZod = z.string().email();
export const givenNameZod = z.string().min(2).max(30);
export const familyNameZod = z.string().min(2).max(30);
