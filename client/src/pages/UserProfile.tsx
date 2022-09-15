import { useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import {
	ShowCurrentUserQuery,
	UpdateUserMutation,
	UpdateUserMutationVariables,
} from "../generated/graphql";
import { MUTATION_UPDATE_USER } from "../queries/User";

const UserProfile = ({ user }: { user: ShowCurrentUserQuery["showMe"] }) => {
	const [updateUser, { loading, error }] = useMutation<
		UpdateUserMutation,
		UpdateUserMutationVariables
	>(MUTATION_UPDATE_USER);
	const [values, setValues] = useState({
		given_name: user?.given_name || "",
		family_name: user?.family_name || "",
		email: user?.email || "",
		address: user?.address || "",
		phone: user?.phone || "",
	});

	console.log("user=", user);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		await updateUser({
			variables: {
				input: {
					id: user!.id,
					...values,
				},
			},
		});
	};
	return (
		<Container className="d-flex flex-column align-items-center">
			<h2 className="mt-4">Profile</h2>
			<p className="text-muted">
				Enter your information to automatically set information required for
				purchasing
			</p>
			<Form className="w-50" onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Your given name</Form.Label>
					<Form.Control
						type="text"
						name="given_name"
						placeholder={"Given name"}
						onChange={handleChange}
						value={values.given_name}
						minLength={2}
						required
					/>
				</Form.Group>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Your family name</Form.Label>
					<Form.Control
						type="text"
						name="family_name"
						placeholder={"Family Name"}
						onChange={handleChange}
						value={values.family_name}
						minLength={2}
						required
					/>
				</Form.Group>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Your email</Form.Label>
					<Form.Control
						type="email"
						name="email"
						placeholder={"Email"}
						onChange={handleChange}
						value={values.email}
					/>
				</Form.Group>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Your address</Form.Label>
					<Form.Control
						type="text"
						name="address"
						placeholder={"Address"}
						onChange={handleChange}
						value={values.address}
					/>
				</Form.Group>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Your phone</Form.Label>
					<Form.Control
						type="tel"
						name="phone"
						placeholder={"Phone number"}
						onChange={handleChange}
						value={values.phone}
					/>
				</Form.Group>
				{error && <Alert variant="danger">{error.message}</Alert>}
				<div className="d-flex justify-content-center">
					<Button type="submit" disabled={loading}>
						{loading ? "Wait..." : "Submit"}
					</Button>
				</div>
			</Form>
		</Container>
	);
};

export default UserProfile;
