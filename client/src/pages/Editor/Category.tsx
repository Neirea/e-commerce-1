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
import { GetAllCategoriesQuery } from "../../generated/graphql";
import {
	QUERY_ALL_CATEGORIES,
	MUTATION_CREATE_CATEGORY,
	MUTATION_DELETE_CATEGORY,
} from "../../queries/Category";

const Category = () => {
	const [loading, setLoading] = useState(true);
	const [parent, setParent] = useState<number | undefined>();
	const [name, setName] = useState<string>("");
	const {
		data,
		loading: queryLoading,
		refetch,
	} = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);
	const [createCategory] = useMutation(MUTATION_CREATE_CATEGORY);
	const [deleteCategory] = useMutation(MUTATION_DELETE_CATEGORY);
	const selectRef = useRef<HTMLSelectElement>(null);

	const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = +e.currentTarget.value || undefined;
		setParent(value);
	};
	const handleName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
		setLoading(true);

		try {
			//error handle message?
			if (!parent) return;
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
			await createCategory({
				variables: {
					input: {
						name: name,
						parent_id: parent,
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
			<h2 className="text-center mt-4">Create new Category</h2>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3 mb-3">
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
							data.categories?.map((elem: any, idx: number) => (
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
