import { useQuery, ApolloQueryResult } from "@apollo/client";
import { createContext, ReactNode, useContext } from "react";
import { ShowCurrentUserQuery } from "../generated/graphql";
import { QUERY_SHOW_ME } from "../queries/User";

interface IAppContext {
	user: ShowCurrentUserQuery["showMe"];
	isLoading: boolean;
	refetchUser: () => Promise<ApolloQueryResult<ShowCurrentUserQuery>>;
}

export const AppContext = createContext({} as IAppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	//set user type? *any
	const {
		data,
		loading: isLoading,
		refetch: refetchUser,
		error,
	} = useQuery<ShowCurrentUserQuery>(QUERY_SHOW_ME);

	if (error) {
		console.log(error);
	}

	return (
		<AppContext.Provider value={{ user: data?.showMe, isLoading, refetchUser }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
