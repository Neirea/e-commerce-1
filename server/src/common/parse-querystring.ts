/*
    from:"  red apple ,   orange, yellow banana      "
    to:"red:*&apple:*|orange:*|yellow:*&banana:*"
*/
export const parseQueryString = (
    input: string | undefined,
): string | undefined => {
    if (!input?.length) return;
    return input
        .replace(/[!:*<()@&|]/g, "")
        .split(",")
        .reduce((query, param) => {
            const trimmedParam = param.trim();
            if (trimmedParam.length > 0) {
                let str = trimmedParam + ":*";
                if (query.length > 0) str = "|" + str;
                query += str;
            }
            return query;
        }, "")
        .replace(/( )+/g, ":*&");
};
