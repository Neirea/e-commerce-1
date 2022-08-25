import { useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";

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
const MUTATION_CREATE_USER = gql`
	mutation CreateUser($input: CreateUserInput!) {
		createUser(input: $input) {
			name
			id
		}
	}
`;

const GQLTest = () => {
	const [username, setUsername] = useState("Neirea");
	const [email, setEmail] = useState("neirea@gmail.com");
	const [avatar, setAvatar] = useState("https://images.com/asdf.jpg");
	const [searchedUserId, setSearchedUserId] = useState<Number>(1);
	const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
	const [fetchUser, { data: singleUser, error: userError }] =
		useLazyQuery(QUERY_SINGLE_USER);
	const [createUser] = useMutation(MUTATION_CREATE_USER);
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
				<button
					onClick={() => {
						createUser({
							variables: { input: { name, username, email, avatar } },
						});
						refetch();
					}}
				></button>
				{singleUser && <h1>HELLO</h1>}
			</>
		);
	}
	if (singleUser) {
	}
	return <></>;
};

export default GQLTest;
