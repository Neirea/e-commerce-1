export const getQueryString = (input: string | null | undefined) => {
    const resultStr = input?.length
        ? input
              .replace(/[\!\:\*\<\(\)\@\&\|]/g, "")
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .join("|")
              .split(" ")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .map((s) => s + ":*")
              .join("&")
        : undefined;

    return resultStr;
};
