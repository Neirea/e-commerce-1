import { useMutation, useQuery } from "@apollo/client";
import React, {
	ChangeEvent,
	FormEvent,
	useState,
	useRef,
	MouseEvent,
} from "react";
import { Container, Form, Button } from "react-bootstrap";
import {
	QUERY_ALL_CATEGORIES,
	MUTATION_CREATE_CATEGORY,
	MUTATION_DELETE_CATEGORY,
} from "../../queries/Category";

const Category = () => {
	const [loading, setLoading] = useState(false);
	const [parent, setParent] = useState<number | undefined>();
	const [name, setName] = useState<string>("");
	const {
		data,
		loading: queryLoading,
		refetch,
	} = useQuery(QUERY_ALL_CATEGORIES);
	const [createCategory] = useMutation(MUTATION_CREATE_CATEGORY);
	const [deleteCategory] = useMutation(MUTATION_DELETE_CATEGORY);
	const selectRef = useRef<HTMLSelectElement>(null);

	const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = +e.currentTarget.value;
		const parent = value || undefined;
		setParent(parent);
	};
	const handleName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
		setLoading(true);

		try {
			deleteCategory({
				variables: {
					id: parent,
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
			if (parent) {
				createCategory({
					variables: {
						input: {
							name: name,
							parent_id: parent,
						},
					},
				});
			} else {
				createCategory({
					variables: {
						input: {
							name: name,
						},
					},
				});
			}
			await refetch();
		} catch (error) {
			console.log(error);
		}

		setLoading(false);
	};

	if (queryLoading || !data) {
		return (
			<Container as="main">
				<h3 className="text-center">Loading...</h3>
			</Container>
		);
	}

	return (
		<>
			<h2 className="text-center mt-4">Create new Category</h2>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Category name"
						onChange={handleName}
						value={name}
					/>
				</Form.Group>
				<Form.Group className="mb-3 d-flex gap-2">
					<Form.Select
						aria-label="Select Parent Category"
						onChange={handleSelect}
						ref={selectRef}
					>
						<option key={0} value={0}>
							{"Choose Parent"}
						</option>
						{data &&
							data.categories.map((elem: any, idx: number) => (
								<option key={idx} value={elem.id}>
									{elem.name}
								</option>
							))}
					</Form.Select>
					<Button onClick={handleDelete} disabled={loading}>
						{loading ? "Wait..." : "Delete"}
					</Button>
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

export default Category;