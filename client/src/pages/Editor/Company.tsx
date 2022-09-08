import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { GetAllCompaniesQuery } from "../../generated/graphql";
import {
	MUTATION_CREATE_COMPANY,
	MUTATION_DELETE_COMPANY,
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
	const [createCompany] = useMutation(MUTATION_CREATE_COMPANY);
	const [deleteCompany] = useMutation(MUTATION_DELETE_COMPANY);
	const selectRef = useRef<HTMLSelectElement>(null);

	const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		setCompanyId(+e.currentTarget.value);
	};
	const handleName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleDelete = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			//error handle message?
			if (!companyId) return;
			await deleteCompany({
				variables: {
					id: companyId,
				},
			});
			if (selectRef.current) selectRef.current.selectedIndex = 0;
			await refetch();
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			// mutation to create Product
			await createCompany({
				variables: {
					input: {
						name: name,
					},
				},
			});
			await refetch();
		} catch (error) {
			console.log(error);
		}

		setLoading(false);
	};

	useEffect(() => {
		if (!queryLoading && data) {
			setLoading(false);
		}
	}, [queryLoading, data]);

	return (
		<>
			<h3 className="text-center mt-5">Create Company</h3>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
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
			<h3 className="text-center mt-5">Delete Company</h3>
			<Form className="m-auto col-sm-10" onSubmit={handleDelete}>
				<Form.Group className="mt-3 d-flex gap-2">
					<Form.Select
						aria-label="Select Company"
						onChange={handleSelect}
						ref={selectRef}
					>
						<option key={0} value={0}>
							{"Choose company to delete"}
						</option>
						{data &&
							data.companies?.map((elem: any, idx: number) => (
								<option key={idx} value={elem.id}>
									{elem.name}
								</option>
							))}
					</Form.Select>
					<Button type="submit" disabled={loading}>
						{loading ? "Wait..." : "Delete"}
					</Button>
				</Form.Group>
			</Form>
		</>
	);
};

export default Company;
