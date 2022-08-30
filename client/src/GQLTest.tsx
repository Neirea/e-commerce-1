import { ChangeEvent, useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";

interface User {
	id: number;
	username: String;
}

interface UsersSuccess {
	users: User[];
}

type UsersResult = { users: UsersSuccess[] };

const QUERY_ALL_USERS = gql`
	query GetAllUsers {
		users {
			... on UsersQueryResult {
				users {
					id
					username
				}
			}
			... on UsersErrorResult {
				message
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
			id
			name
			username
		}
	}
`;

const GQLTest = () => {
	const [values, setValues] = useState({
		name: "Eugene",
		username: "Neirea",
		email: "neirea@gmail.com",
		avatar: "https://images.com/asdf.jpg",
	});

	const [searchedUserId, setSearchedUserId] = useState<Number>(1);
	const { data, loading, error, refetch } = useQuery<{
		users: UsersResult;
	}>(QUERY_ALL_USERS);
	const [fetchUser, { data: singleUser, error: userError }] =
		useLazyQuery(QUERY_SINGLE_USER);
	const [createUser, { error: createUserError }] =
		useMutation(MUTATION_CREATE_USER);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.id]: e.target.value });
	};

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Oops... Some error!</div>;
	}
	if (data) {
		return (
			<>
				{/* Get Single User */}
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
				{/* Create New User */}
				<form
					style={{ display: "flex", marginTop: "2rem" }}
					onSubmit={async (e) => {
						e.preventDefault();
						await createUser({
							variables: {
								input: {
									name: values.name,
									username: values.username,
									email: values.email,
									avatar: values.avatar,
								},
							},
						});
						await refetch();
					}}
				>
					<label htmlFor="name">Name</label>
					<input
						id="name"
						type="text"
						value={values.name}
						onChange={handleChange}
					/>
					<label htmlFor="username">Username</label>
					<input
						id="username"
						type="text"
						value={values.username}
						onChange={handleChange}
					/>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="text"
						value={values.email}
						onChange={handleChange}
					/>
					<label htmlFor="avatar">Avatar Url</label>
					<input
						id="avatar"
						type="text"
						value={values.avatar}
						onChange={handleChange}
					/>
					<button type="submit">Create User</button>
				</form>
				<div>{createUserError && <p>{createUserError.message}</p>}</div>
				{data.users &&
					data.users.users.map((user: any, idx: number) => {
						return <p key={idx}>{user.username}</p>;
					})}
			</>
		);
	}
	return <></>;
};

export default GQLTest;
