import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState, useRef } from "react";
import { Form, Button, Alert } from "react-bootstrap";
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
import { ImageResult } from "../../commonTypes";
import { serverUrl } from "../../utils/server";

const Category = () => {
	const [uploadLoading, setUploadLoading] = useState(false);
	const [categoryId, setCategoryId] = useState<number>(0);
	const [name, setName] = useState<string>("");
	const [parentId, setParentId] = useState<number>(0);
	const [selectedImage, setSelectedImage] = useState<File | undefined>();
	const {
		data,
		loading: categoryLoading,
		error: categoryError,
		refetch,
	} = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);
	const [
		createCategory,
		{ loading: createCategoryLoading, error: createCategoryError },
	] = useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(
		MUTATION_CREATE_CATEGORY
	);
	const [
		updateCategory,
		{ loading: updateCategoryLoading, error: updateCategoryError },
	] = useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(
		MUTATION_UPDATE_CATEGORY
	);
	const [
		deleteCategory,
		{ loading: deleteCategoryLoading, error: deleteCategoryError },
	] = useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(
		MUTATION_DELETE_CATEGORY
	);
	const filesRef = useRef<HTMLInputElement>(null);

	const loading =
		uploadLoading ||
		categoryLoading ||
		createCategoryLoading ||
		updateCategoryLoading ||
		deleteCategoryLoading ||
		!data;

	const mutationError =
		createCategoryError || updateCategoryError || deleteCategoryError;

	const resetForm = () => {
		setName("");
		setCategoryId(0);
		setParentId(0);
		if (filesRef.current) filesRef.current.value = "";
	};

	const handleParentSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		setParentId(+e.target.value);
	};

	const handleName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const idx = +e.target.value;

		if (idx === 0) {
			resetForm();
			return;
		}
		if (data?.categories) {
			const category = data.categories.find((item) => item.id === idx)!;
			if (category.parent) {
				setParentId(category.parent.id);
			}
			setCategoryId(idx);
			setName(category.name);
		}
	};

	const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files.length) {
			setSelectedImage(undefined);
			return;
		}
		setSelectedImage(e.target.files[0]);
	};

	const handleDelete = async () => {
		if (!categoryId) return;
		await deleteCategory({
			variables: {
				id: categoryId,
			},
		});
		await refetch();
		resetForm();
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		let img_src;
		let img_id;

		if (selectedImage) {
			setUploadLoading(true);
			const formData = new FormData();
			formData.append("images", selectedImage);

			const imageResult = await fetch(`${serverUrl}/editor/upload-images`, {
				method: "POST",
				body: formData,
			})
				.then((res) => res.json())
				.then((res: ImageResult) => res);
			img_id = imageResult.images[0].img_id;
			img_src = imageResult.images[0].img_src;
			setUploadLoading(false);
		}

		if (categoryId) {
			await updateCategory({
				variables: {
					input: {
						id: categoryId,
						name: name,
						parent_id: parentId,
						img_id,
						img_src,
					},
				},
			});
		} else {
			await createCategory({
				variables: {
					input: {
						name: name,
						parent_id: parentId,
						img_id,
						img_src,
					},
				},
			});
		}
		await refetch();
		resetForm();
		setSelectedImage(undefined);
	};

	return (
		<>
			<h2 className="text-center mt-4">Category</h2>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Choose category to create, update or delete</Form.Label>
					{categoryError && (
						<Alert variant="danger">{categoryError.message}</Alert>
					)}
					<div className="d-flex gap-2">
						<Form.Select
							aria-label="Create category to create, update or delete"
							value={categoryId.toString()}
							onChange={handleCategorySelect}
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
						<Button onClick={handleDelete} disabled={loading || !categoryId}>
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
						minLength={3}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Select
						aria-label="Select Parent Category"
						value={parentId.toString()}
						onChange={handleParentSelect}
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
				<Form.Group className="mb-3">
					<Form.Label>
						Image (for updating: doesn't update if no image selected)
					</Form.Label>
					<Form.Control
						type="file"
						accept="image/*"
						ref={filesRef}
						onChange={handleUpload}
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

export default Category;
