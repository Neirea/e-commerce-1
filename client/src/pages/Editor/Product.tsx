import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { ImageResult } from "../../commonTypes";
import {
	CreateProductMutation,
	CreateProductMutationVariables,
	DeleteProductMutation,
	DeleteProductMutationVariables,
	GetAllCategoriesQuery,
	GetAllCompaniesQuery,
	GetAllProductsQuery,
	UpdateProductMutation,
	UpdateProductMutationVariables,
} from "../../generated/graphql";
import { QUERY_ALL_CATEGORIES } from "../../queries/Category";
import { QUERY_ALL_COMPANIES } from "../../queries/Company";
import {
	MUTATION_CREATE_PRODUCT,
	MUTATION_DELETE_PRODUCT,
	MUTATION_UPDATE_PRODUCT,
	QUERY_ALL_PRODUCT,
} from "../../queries/Product";
import isJSON from "../../utils/isJSON";
import { serverUrl } from "../../utils/server";

const defaultValues = {
	name: "",
	description: "",
	price: 0,
	inventory: 0,
	company_id: 0,
	category_id: 0,
	shipping_cost: 15,
	discount: 0,
};

const Product = () => {
	const {
		data: productData,
		loading: productLoading,
		error: productError,
	} = useQuery<GetAllProductsQuery>(QUERY_ALL_PRODUCT);
	const {
		data: companyData,
		loading: companyLoading,
		error: companyError,
	} = useQuery<GetAllCompaniesQuery>(QUERY_ALL_COMPANIES);
	const {
		data: categoryData,
		loading: categoryLoading,
		error: categoryError,
	} = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);
	const [
		createProduct,
		{ loading: createProductLoading, error: createProductError },
	] = useMutation<CreateProductMutation, CreateProductMutationVariables>(
		MUTATION_CREATE_PRODUCT
	);
	const [
		updateProduct,
		{ loading: updateProductLoading, error: updateProductError },
	] = useMutation<UpdateProductMutation, UpdateProductMutationVariables>(
		MUTATION_UPDATE_PRODUCT
	);
	const [
		deleteProduct,
		{ loading: deleteProductLoading, error: deleteProductError },
	] = useMutation<DeleteProductMutation, DeleteProductMutationVariables>(
		MUTATION_DELETE_PRODUCT
	);

	const [productId, setProductId] = useState<number>(0);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
	const [values, setValues] = useState(defaultValues);
	const [inputError, setInputError] = useState(0);
	const [uploadLoading, setUploadLoading] = useState(false);
	const filesRef = useRef<HTMLInputElement>(null);

	const loading =
		uploadLoading ||
		companyLoading ||
		categoryLoading ||
		productLoading ||
		createProductLoading ||
		updateProductLoading ||
		deleteProductLoading ||
		!productData ||
		!companyData ||
		!categoryData;

	const dataError = productError || deleteProductError;
	const upsertError = createProductError || updateProductError;

	const isJson = useMemo(
		() => isJSON(values.description),
		[values.description]
	);

	const resetForm = () => {
		setValues(defaultValues);
		setProductId(0);
		setSelectedVariants([]);
		if (filesRef.current) filesRef.current.value = "";
	};

	const handleProductSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const idx = +e.target.value;
		if (idx === 0) {
			resetForm();
			return;
		}

		if (productData?.products) {
			const product = productData.products.find((item) => item.id === idx)!;
			setProductId(idx);
			setSelectedVariants(product.variants.map((i) => i.id.toString()));
			setValues({
				name: product.name,
				description: JSON.stringify(product.description),
				price: product.price,
				inventory: product.inventory,
				company_id: product.company.id,
				category_id: product.category.id,
				shipping_cost: product.shipping_cost,
				discount: product.discount,
			});
		}
	};

	const handleVariantSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedVariants(
			[...e.target.selectedOptions].map((opt) => {
				return opt.value;
			})
		);
	};

	const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files.length) {
			setSelectedImages([]);
			return;
		}
		setSelectedImages([...e.target.files]);
	};
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		if (e.target.name === "name" || e.target.name === "description") {
			setValues({ ...values, [e.target.name]: e.target.value });
			return;
		}
		setValues({ ...values, [e.target.name]: +e.target.value });
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		//decide where to show error;
		if (!isJson) {
			setInputError(1);
			return;
		}
		if (!values.company_id) {
			setInputError(2);
			return;
		}
		if (!values.category_id) {
			setInputError(3);
			return;
		}

		const newProduct = {
			...values,
			variants: selectedVariants.map((i) => +i),
			description: JSON.parse(values.description),
			img_id: [] as string[],
			img_src: [] as string[],
		};
		if (selectedImages.length) {
			setUploadLoading(true);
			const formData = new FormData();

			selectedImages.forEach((image) => {
				formData.append("images", image);
			});
			const imageResult = await fetch(`${serverUrl}/api/editor/upload-images`, {
				method: "POST",
				body: formData,
			})
				.then((res) => res.json())
				.then((res: ImageResult) => res);
			newProduct.img_id = imageResult.images.map((i) => i.img_id);
			newProduct.img_src = imageResult.images.map((i) => i.img_src);
			setUploadLoading(false);
		}

		if (productId) {
			await updateProduct({
				variables: {
					input: { ...newProduct, id: productId },
				},
				refetchQueries: ["GetAllProducts"],
			});
		} else {
			await createProduct({
				variables: { input: newProduct },
				refetchQueries: ["GetAllProducts"],
			});
		}
		resetForm();
		setInputError(0);
		setSelectedImages([]);
	};

	const handleDelete = async () => {
		if (!productId) return;
		await deleteProduct({
			variables: {
				id: productId,
			},
			refetchQueries: ["GetAllProducts"],
		});
		resetForm();
	};

	return (
		<>
			<h2 className="text-center mt-4">Product</h2>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Choose product to create, update or delete</Form.Label>
					{dataError && <Alert variant="danger">{dataError.message}</Alert>}
					<div className="d-flex gap-2">
						<Form.Select
							aria-label="Create or Choose Product to update"
							value={productId}
							onChange={handleProductSelect}
						>
							<option value={0}>{"Create new Product"}</option>
							{productData &&
								productData.products?.map((elem) => (
									<option key={uuidv4()} value={elem.id}>
										{elem.name}
									</option>
								))}
						</Form.Select>
						<Button disabled={loading || !productId} onClick={handleDelete}>
							{loading ? "Wait..." : "Delete"}
						</Button>
					</div>
				</Form.Group>

				<Form.Group className="mt-3 mb-3">
					<Form.Control
						type="text"
						name="name"
						placeholder="Product name"
						onChange={handleChange}
						value={values.name}
						minLength={3}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Price</Form.Label>
					<Form.Control
						type="number"
						name="price"
						placeholder="Float number in USD"
						onChange={handleChange}
						value={values.price}
						min={0}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Description</Form.Label>
					{inputError === 1 && <Alert variant="danger">Invalid Json</Alert>}
					<Form.Control
						as="textarea"
						rows={7}
						name="description"
						isValid={isJson}
						onChange={handleChange}
						value={values.description}
						placeholder={`JSON of product description:\n{\n\tname:"Iphone 11",\n\tprice: 1000,\n\t ...\n}`}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Inventory</Form.Label>
					<Form.Control
						type="number"
						name="inventory"
						placeholder="Amount of available goods"
						onChange={handleChange}
						value={values.inventory}
						min={0}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Shipping cost</Form.Label>
					<Form.Control
						type="number"
						name="shipping_cost"
						placeholder="Float number in USD"
						onChange={handleChange}
						value={values.shipping_cost}
						min={0}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Discount</Form.Label>
					<Form.Control
						type="number"
						name="discount"
						placeholder="% number of base price discount"
						onChange={handleChange}
						value={values.discount}
						min={0}
						max={100}
					/>
				</Form.Group>
				{companyError && <Alert variant="danger">{companyError.message}</Alert>}
				{inputError === 2 && <Alert variant="danger">Choose company</Alert>}
				<Form.Select
					aria-label="Select Company"
					className="mt-3 mb-3"
					name="company_id"
					onChange={handleChange}
					value={values.company_id}
				>
					<option disabled hidden value={0}>
						{"Choose company"}
					</option>
					{companyData &&
						companyData.companies?.map((elem) => (
							<option key={uuidv4()} value={elem.id}>
								{elem.name}
							</option>
						))}
				</Form.Select>
				<Form.Group className="mt-3 mb-3">
					{categoryError && (
						<Alert variant="danger">{categoryError.message}</Alert>
					)}
					{inputError === 3 && <Alert variant="danger">Choose category</Alert>}
					<Form.Select
						aria-label="Select Category"
						name="category_id"
						value={values.category_id}
						onChange={handleChange}
					>
						<option disabled hidden value={0}>
							{"Choose category"}
						</option>
						{categoryData &&
							categoryData.categories?.map((elem) => (
								<option key={uuidv4()} value={elem.id}>
									{elem.name}
								</option>
							))}
					</Form.Select>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>
						Variants
						<span className="text-muted"> (Hold Ctrl to select multiple)</span>
					</Form.Label>
					<Form.Select
						aria-label="Choose variants"
						value={selectedVariants}
						onChange={handleVariantSelect}
						size="sm"
						multiple
					>
						{productData &&
							productData.products?.map((elem) => (
								<option key={uuidv4()} value={elem.id}>
									{elem.name}
								</option>
							))}
					</Form.Select>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>
						Images (for updating: doesn't update if no images selected)
					</Form.Label>
					<Form.Control
						type="file"
						accept="image/*"
						multiple
						ref={filesRef}
						onChange={handleFiles}
					/>
				</Form.Group>
				{upsertError && <Alert variant="danger">{upsertError.message}</Alert>}
				<div className="d-flex justify-content-center">
					<Button type="submit" disabled={loading}>
						{loading ? "Wait..." : "Submit"}
					</Button>
				</div>
			</Form>
		</>
	);
};

export default Product;
