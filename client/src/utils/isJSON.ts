const isJSON = (input: string): boolean => {
    try {
        const o = JSON.parse(input) as unknown;
        if (o && typeof o === "object") {
            return true;
        }
    } catch (error) {
        console.error(error);
    }
    return false;
};

export default isJSON;
