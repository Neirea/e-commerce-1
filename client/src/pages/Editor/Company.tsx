import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
	const [loading, setLoading] = useState(true);
	const [companyId, setCompanyId] = useState<number | undefined>();
	const [name, setName] = useState<string>("");
	const {
		data,
		loading: queryLoading,
		refetch,
	} = useQuery<GetAllCompaniesQuery>(QUERY_ALL_COMPANIES);
	const [createCompany] = useMutation<
		CreateCompanyMutation,
		CreateCompanyMutationVariables
	>(MUTATION_CREATE_COMPANY);
	const [updateCompany] = useMutation<
		UpdateCompanyMutation,
		UpdateCompanyMutationVariables
	>(MUTATION_UPDATE_COMPANY);
	const [deleteCompany] = useMutation<
		DeleteCompanyMutation,
		DeleteCompanyMutationVariables
	>(MUTATION_DELETE_COMPANY);
	const selectRef = useRef<HTMLSelectElement>(null);

	const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const idx = +e.target.value;
		setCompanyId(idx);
		if (idx === 0) {
			setName("");
			return;
		}
		if (data?.companies) {
			const company = data.companies.find((item) => item.id === idx)!;
			setName(company.name);
		}
	};
	const handleName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleDelete = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		//error handle message?
		if (!companyId || !selectRef.current) return;
		await deleteCompany({
			variables: {
				id: companyId,
			},
		});
		await refetch();
		if (selectRef.current) selectRef.current.selectedIndex = 0;
		setCompanyId(0);
		setLoading(false);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		if (companyId) {
			//update
			await updateCompany({
				variables: {
					input: {
						id: companyId,
						name: name,
					},
				},
			});
		} else {
			await createCompany({
				variables: {
					input: {
						name: name,
					},
				},
			});
		}

		await refetch();
		if (selectRef.current) selectRef.current.selectedIndex = 0;
		setCompanyId(0);
		setLoading(false);
	};

	useEffect(() => {
		if (!queryLoading && data) {
			setLoading(false);
		}
	}, [queryLoading, data]);

	return (
		<>
			<h3 className="text-center mt-5">Company</h3>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3">
					<Form.Label>Choose company to create, update or delete</Form.Label>
					<div className="d-flex gap-2">
						<Form.Select
							aria-label="Choose company to create, update or delete"
							onChange={handleSelect}
							ref={selectRef}
						>
							<option key={"delete-0"} value={0}>
								{"Create new company"}
							</option>
							{data &&
								data.companies?.map((elem: any) => (
									<option key={`delete-${elem.id}`} value={elem.id}>
										{elem.name}
									</option>
								))}
						</Form.Select>
						<Button disabled={loading} onClick={handleDelete}>
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
					/>
				</Form.Group>
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
