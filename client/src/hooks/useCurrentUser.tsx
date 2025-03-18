import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../queries/User";
import type { TUser } from "../types/User";

export type TCurrentUser = {
    user: TUser | undefined;
    isLoading: boolean;
    getUpdatedUser: () => Promise<void>;
};

const useCurrentUser = (): TCurrentUser => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["me"],
        queryFn: getCurrentUser,
    });

    const user = isError || !data?.data ? undefined : data?.data;

    const getUpdatedUser = async (): Promise<void> => {
        await refetch();
    };

    return {
        user,
        getUpdatedUser,
        isLoading,
    };
};

export default useCurrentUser;
