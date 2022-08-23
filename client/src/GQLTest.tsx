import { useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";

const QUERY_ALL_USERS = gql`
	query GetAllUsers {
		users {
			id
			username
			role
			profile {
				id
				avatar
			}
		}
	}
`;

const QUERY_SINGLE_USER = gql`
	query GetSingleUser($id: ID!) {
		user(id: $id) {
			id
			username
			role
		}
	}
`;

const GQLTest = () => {
	const [searchedUserId, setSearchedUserId] = useState<Number>(1);
	const { data, loading, error } = useQuery(QUERY_ALL_USERS);
	const [fetchUser, { data: singleUser, error: userError }] =
		useLazyQuery(QUERY_SINGLE_USER);
	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Oops... Some error!</div>;
	}
	if (data) {
		return (
			<>
				<div>GOT SOME DATA</div>{" "}
				<button
					onClick={() =>
						fetchUser({
							variables: {
								id: 1,
							},
						})
					}
				>
					Click me
				</button>
				{singleUser && <h1>HELLO</h1>}
			</>
		);
	}
	if (singleUser) {
	}
	return <></>;
};

export default GQLTest;
