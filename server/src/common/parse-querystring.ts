export const parseQueryString = (
    input: string | undefined,
): string | undefined => {
    if (!input?.length) return;
    return input
        .replace(/[\!\:\*\<\(\)\@\&\|]/g, "")
        .split(",")
        .reduce<string[]>((filtered, s) => {
            const trimmed = s.trim();
            if (trimmed.length > 0) {
                const transformedValue = trimmed.replace(/( )+/g, ":*&");
                filtered.push(transformedValue + ":*");
            }
            return filtered;
        }, [])
        .join("|");
};
