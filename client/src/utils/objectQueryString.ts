type MyObject = {
    [key: string]:
        | number
        | string
        | boolean
        | undefined
        | null
        | (string | null)[];
};

export const objectToQueryString = (obj: MyObject): string => {
    const params: string[] = [];

    for (const key in obj) {
        if (Object.hasOwn(obj, key) && obj[key] && !Array.isArray(obj[key])) {
            const value = encodeURIComponent(obj[key]);
            const param = `${encodeURIComponent(key)}=${value}`;
            params.push(param);
        }
    }

    return params.join("&");
};
