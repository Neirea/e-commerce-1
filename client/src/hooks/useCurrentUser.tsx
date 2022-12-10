import { useQuery } from "@apollo/client";
import { ShowCurrentUserQuery } from "../generated/graphql";
import { QUERY_SHOW_ME } from "../queries/User";

export interface ICurrentUser {
    user: ShowCurrentUserQuery["showMe"];
    isLoading: boolean;
}

const useCurrentUser = (): ICurrentUser => {
    const {
        data,
        loading: isLoading,
        error,
    } = useQuery<ShowCurrentUserQuery>(QUERY_SHOW_ME);

    if (error) {
        console.log(error);
    }
    return {
        user: data?.showMe,
        isLoading,
    };
};

export default useCurrentUser;
