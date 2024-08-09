import { useQuery } from "@tanstack/react-query";
import type { TUser } from "../types/User";
import { getCurrentUser } from "../queries/User";

export type TCurrentUser = {
    user: TUser | undefined;
    isLoading: boolean;
};

const useCurrentUser = (): TCurrentUser => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["me"],
        queryFn: getCurrentUser,
    });

    const user = isError ? undefined : data?.data;

    return {
        user,
        isLoading,
    };
};

export default useCurrentUser;
