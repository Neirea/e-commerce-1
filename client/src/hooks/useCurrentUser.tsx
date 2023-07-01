import { useQuery } from "@tanstack/react-query";
import { IUser } from "../types/User";
import { getCurrentUser } from "../queries/User";

export interface ICurrentUser {
    user: IUser | undefined;
    isLoading: boolean;
}

const useCurrentUser = (): ICurrentUser => {
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
