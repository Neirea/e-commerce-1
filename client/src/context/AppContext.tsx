import { useQuery, ApolloQueryResult } from "@apollo/client";
import { createContext, ReactNode, useContext } from "react";
import { ShowCurrentUserQuery } from "../generated/graphql";
import { QUERY_SHOW_ME } from "../queries/User";

interface IAppContext {
	user: ShowCurrentUserQuery["showMe"];
	isLoading: boolean;
}

export const AppContext = createContext({} as IAppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const {
		data,
		loading: isLoading,
		error,
	} = useQuery<ShowCurrentUserQuery>(QUERY_SHOW_ME);

	if (error) {
		console.log(error);
	}

	return (
		<AppContext.Provider value={{ user: data?.showMe, isLoading }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
