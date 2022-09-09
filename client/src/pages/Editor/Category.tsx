import { useMutation, useQuery } from "@apollo/client";
import {
	ChangeEvent,
	FormEvent,
	useState,
	useRef,
	MouseEvent,
	useEffect,
} from "react";
import { Form, Button } from "react-bootstrap";
import type {
	CreateCategoryMutation,
	CreateCategoryMutationVariables,
	GetAllCategoriesQuery,
	UpdateCategoryMutation,
	UpdateCategoryMutationVariables,
	DeleteCategoryMutation,
	DeleteCategoryMutationVariables,
} from "../../generated/graphql";
import {
	QUERY_ALL_CATEGORIES,
	MUTATION_CREATE_CATEGORY,
	MUTATION_UPDATE_CATEGORY,
	MUTATION_DELETE_CATEGORY,
} from "../../queries/Category";

const Category = () => {
	const [categoryId, setCategoryId] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [parentId, setParentId] = useState<number | undefined>();
	const [name, setName] = useState<string>("");
	const {
		data,
		loading: queryLoading,
		refetch,
	} = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);
	const [createCategory] = useMutation<
		CreateCategoryMutation,
		CreateCategoryMutationVariables
	>(MUTATION_CREATE_CATEGORY);
	const [updateCategory] = useMutation<
		UpdateCategoryMutation,
		UpdateCategoryMutationVariables
	>(MUTATION_UPDATE_CATEGORY);
	const [deleteCategory] = useMutation<
		DeleteCategoryMutation,
		DeleteCategoryMutationVariables
	>(MUTATION_DELETE_CATEGORY);
	const selectParentRef = useRef<HTMLSelectElement>(null);
	const selectCategoryRef = useRef<HTMLSelectElement>(null);

	const handleParentSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = +e.currentTarget.value || undefined;
		setParentId(value);
	};

	const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const idx = +e.target.value;
		setCategoryId(idx);
		if (idx === 0) {
			setName("");
			if (selectParentRef.current) selectParentRef.current.selectedIndex = 0;
			return;
		}
		if (data?.categories) {
			const category = data.categories.find((item) => item.id === idx)!;
			setName(category.name);
			if (selectParentRef.current) {
				const parentOptionIndex = data.categories.findIndex(
					(item) => item.parent_id === category.parent_id
				)!;
				selectParentRef.current.selectedIndex = parentOptionIndex || 0;
			}
		}
	};

	const handleName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
		setLoading(true);

		//error handle message?
		if (!parentId) return;
		deleteCategory({
			variables: {
				id: categoryId,
			},
		});
		if (selectParentRef.current) selectParentRef.current.selectedIndex = 0;
		if (selectCategoryRef.current) selectCategoryRef.current.selectedIndex = 0;
		await refetch();
		setParentId(0);
		setCategoryId(0);
		setLoading(false);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		if (!selectCategoryRef.current) return;
		if (categoryId) {
			await updateCategory({
				variables: {
					input: {
						id: categoryId,
						name: name,
						parent_id: parentId,
					},
				},
			});
		} else {
			await createCategory({
				variables: {
					input: {
						name: name,
						parent_id: parentId,
					},
				},
			});
		}
		await refetch();
		if (selectParentRef.current) selectParentRef.current.selectedIndex = 0;
		selectCategoryRef.current.selectedIndex = 0;
		setCategoryId(0);
		setParentId(0);
		setLoading(false);
	};

	useEffect(() => {
		if (!queryLoading && data) {
			setLoading(false);
		}
	}, [queryLoading, data]);

	return (
		<>
			<h2 className="text-center mt-4">Category</h2>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Choose category to create, update or delete</Form.Label>
					<div className="d-flex gap-2">
						<Form.Select
							aria-label="Create category to create, update or delete"
							onChange={handleCategorySelect}
							ref={selectCategoryRef}
						>
							<option key={"category_upsert-0"} value={0}>
								{"Create new category"}
							</option>
							{data &&
								data.categories?.map((elem: any) => (
									<option key={`category_upsert-${elem.id}`} value={elem.id}>
										{elem.name}
									</option>
								))}
						</Form.Select>
						<Button onClick={handleDelete} disabled={loading}>
							{loading ? "Wait..." : "Delete"}
						</Button>{" "}
					</div>
				</Form.Group>
				<Form.Group className="mt-3 mb-3">
					<Form.Control
						type="text"
						placeholder="Category name"
						onChange={handleName}
						value={name}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Select
						aria-label="Select Parent Category"
						onChange={handleParentSelect}
						ref={selectParentRef}
					>
						<option key={"parent-0"} value={0}>
							{"Choose Parent"}
						</option>
						{data &&
							data.categories?.map((elem: any) => (
								<option key={`parent-${elem.id}`} value={elem.id}>
									{elem.name}
								</option>
							))}
					</Form.Select>
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
