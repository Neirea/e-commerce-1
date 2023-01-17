export const getQueryString = (input: string | null | undefined) => {
    const resultStr = input?.length
        ? input
              .replace(/[\!\:\*\<\(\)\@\&\|]/g, "")
              .split(",")
              .reduce<string[]>((filtered, s) => {
                  const trimmed = s.trim();
                  if (trimmed.length > 0) {
                      filtered.push(trimmed + ":*");
                  }
                  return filtered;
              }, [])
              .join("|")
              .replace(/( )+/g, ":*&")
        : undefined;

    return resultStr;
};
