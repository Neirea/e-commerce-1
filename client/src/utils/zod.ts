import { z } from "zod";

export const addressDesc =
    "Country(optional), State(optional), City, Street, Building number, Appartment number(optional)";
export const addressRegex =
    /([a-zA-Z ]+,( )?)?([a-zA-Z ]+,( )?)?[a-zA-Z ]+,( )?[a-zA-Z ]+,( )?[0-9a-zA-Z]+(,( )?([0-9]+))?/;
export const phoneDesc =
    "+ or 00 for country code; you can use /,(),- for the remaining number";
export const phoneRegex = /(\+|00)[1-9][0-9 \-\(\)]{7,32}/;

export const addressZod = z.string().regex(addressRegex);

export const phoneZod = z.string().regex(phoneRegex).or(z.string().length(0));
export const emailZod = z.string().email();
export const givenNameZod = z.string().min(2).max(30);
export const familyNameZod = z.string().min(2).max(30);
