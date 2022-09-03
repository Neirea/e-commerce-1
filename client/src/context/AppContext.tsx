import { useQuery } from "@apollo/client";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { QUERY_SHOW_ME } from "../queries/User";

export const AppContext = createContext({} as any);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	//set user type? *any
	const { data, loading: isLoading, error } = useQuery(QUERY_SHOW_ME);
	const user = data?.showMe;

	// if (user) {
	// 	console.log("User=", user);
	// }

	// useEffect(() => {
	// 	const getUser = async () => {
	// 		const testUser = await fetch("http://localhost:5000/showMe", {
	// 			credentials: "include",
	// 		}).then((res) => console.log(res.json()));
	// 	};
	// 	getUser();
	// }, []);

	return (
		<AppContext.Provider value={{ user, isLoading }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
