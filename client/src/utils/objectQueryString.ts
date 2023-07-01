type MyObject = {
    [key: string]: any;
};

export const objectToQueryString = (obj: MyObject) => {
    const params = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
            const value = encodeURIComponent(obj[key]);
            const param = `${encodeURIComponent(key)}=${value}`;
            params.push(param);
        }
    }

    return params.join("&");
};
