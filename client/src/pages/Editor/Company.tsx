import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import {
	CreateCompanyMutation,
	CreateCompanyMutationVariables,
	DeleteCompanyMutation,
	DeleteCompanyMutationVariables,
	GetAllCompaniesQuery,
	UpdateCompanyMutation,
	UpdateCompanyMutationVariables,
} from "../../generated/graphql";
import {
	MUTATION_CREATE_COMPANY,
	MUTATION_DELETE_COMPANY,
	MUTATION_UPDATE_COMPANY,
	QUERY_ALL_COMPANIES,
} from "../../queries/Company";

const Company = () => {
	const [companyId, setCompanyId] = useState<number>(0);
	const [name, setName] = useState<string>("");
	const {
		data,
		loading: companyLoading,
		error: companyError,
	} = useQuery<GetAllCompaniesQuery>(QUERY_ALL_COMPANIES);
	const [
		createCompany,
		{ error: createCompanyError, loading: createCompanyLoading },
	] = useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(
		MUTATION_CREATE_COMPANY
	);
	const [
		updateCompany,
		{ error: updateCompanyError, loading: updateCompanyLoading },
	] = useMutation<UpdateCompanyMutation, UpdateCompanyMutationVariables>(
		MUTATION_UPDATE_COMPANY
	);
	const [
		deleteCompany,
		{ error: deleteCompanyError, loading: deleteCompanyLoading },
	] = useMutation<DeleteCompanyMutation, DeleteCompanyMutationVariables>(
		MUTATION_DELETE_COMPANY
	);
	const loading =
		companyLoading ||
		createCompanyLoading ||
		updateCompanyLoading ||
		deleteCompanyLoading ||
		!data;

	const mutationError =
		createCompanyError || updateCompanyError || deleteCompanyError;

	const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const idx = +e.target.value;
		if (idx === 0) {
			setName("");
			return;
		}
		if (data?.companies) {
			const company = data.companies.find((item) => item.id === idx)!;
			setName(company.name);
			setCompanyId(idx);
		}
	};
	const handleName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleDelete = async () => {
		if (!companyId) return;
		await deleteCompany({
			variables: {
				id: companyId,
			},
			refetchQueries: ["GetAllCompanies"],
		});
		setName("");
		setCompanyId(0);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (companyId) {
			//update
			await updateCompany({
				variables: {
					input: {
						id: companyId,
						name: name,
					},
				},
				refetchQueries: ["GetAllCompanies"],
			});
		} else {
			await createCompany({
				variables: {
					input: {
						name: name,
					},
				},
				refetchQueries: ["GetAllCompanies"],
			});
		}

		setName("");
		setCompanyId(0);
	};

	return (
		<>
			<h3 className="text-center mt-5">Company</h3>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3">
					<Form.Label>Choose company to create, update or delete</Form.Label>
					{companyError && (
						<Alert variant="danger">{companyError.message}</Alert>
					)}
					<div className="d-flex gap-2">
						<Form.Select
							aria-label="Choose company to create, update or delete"
							onChange={handleSelect}
							value={companyId.toString()}
						>
							<option value={0}>{"Create new company"}</option>
							{data &&
								data.companies?.map((elem) => (
									<option key={uuidv4()} value={elem.id}>
										{elem.name}
									</option>
								))}
						</Form.Select>
						<Button disabled={loading || !companyId} onClick={handleDelete}>
							{loading ? "Wait..." : "Delete"}
						</Button>
					</div>
				</Form.Group>
				<Form.Group className="mt-3 mb-3">
					<Form.Control
						type="text"
						placeholder="Company name"
						onChange={handleName}
						value={name}
						minLength={3}
						required
					/>
				</Form.Group>
				{mutationError && (
					<Alert variant="danger">{mutationError.message}</Alert>
				)}
				<div className="d-flex justify-content-center">
					<Button type="submit" disabled={loading}>
						{loading ? "Wait..." : "Submit"}
					</Button>
				</div>
			</Form>
		</>
	);
};

export default Company;
