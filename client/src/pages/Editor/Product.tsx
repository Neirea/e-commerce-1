import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState, useRef, useMemo } from "react";
import { Form, Button, Alert } from "react-bootstrap";
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

interface ImageResult {
	img_id: string;
	img_src: string;
}

const defaultValues = {
	name: "",
	description: "",
	price: 0,
	inventory: 0,
	company_id: 0,
	category_id: 0,
	shipping_cost: 0,
	discount: 0,
};

const CreateProduct = () => {
	const {
		data: productData,
		loading: productLoading,
		error: productError,
		refetch,
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
	const [values, setValues] = useState(defaultValues);
	const [jsonError, setJsonError] = useState(false);
	const selectProductRef = useRef<HTMLSelectElement>(null);
	const selectCategoryRef = useRef<HTMLSelectElement>(null);
	const selectCompanyRef = useRef<HTMLSelectElement>(null);

	const loading =
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

	const handleProductSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const idx = +e.target.value;

		setProductId(idx);
		if (idx === 0) {
			setValues(defaultValues);
			if (selectCategoryRef.current)
				selectCategoryRef.current.selectedIndex = 0;
			if (selectCompanyRef.current) selectCompanyRef.current.selectedIndex = 0;
			return;
		}
		if (productData?.products) {
			const product = productData.products.find((item) => item.id === idx)!;

			setValues({
				name: product.name,
				description: JSON.stringify(product.description),
				price: product.price,
				inventory: product.inventory,
				company_id: product.company_id,
				category_id: product.category_id,
				shipping_cost: product.shipping_cost,
				discount: product.discount,
			});
			console.log("product company id=", product.company_id);
			console.log("product category id=", product.category_id);

			if (selectCompanyRef.current) {
				selectCompanyRef.current.selectedIndex = [
					...selectCompanyRef.current.options,
				].findIndex((option) => +option.value === product.company_id);
			}
			if (selectCategoryRef.current) {
				selectCategoryRef.current.selectedIndex = [
					...selectCategoryRef.current.options,
				].findIndex((option) => +option.value === product.category_id);
			}
		}
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
		if (!isJson) {
			setJsonError(true);
			return;
		}

		const newProduct = {
			...values,
			description: JSON.parse(values.description),
			img_id: [] as string[],
			img_src: [] as string[],
		};
		if (selectedImages.length) {
			const formData = new FormData();

			selectedImages.forEach((image) => {
				formData.append("images", image);
			});
			const imageResult = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/editor/upload-images`,
				{
					method: "POST",
					body: formData,
				}
			)
				.then((res) => res.json())
				.then((res: { images: ImageResult[] }) => res);
			newProduct.img_id = imageResult.images.map((i) => i.img_id);
			newProduct.img_src = imageResult.images.map((i) => i.img_src);
		}

		if (productId) {
			await updateProduct({
				variables: { input: { ...newProduct, id: productId } },
			});
		} else {
			await createProduct({ variables: { input: newProduct } });
		}
		await refetch();
		setJsonError(false);
		setValues(defaultValues);
		setProductId(0);
		//open modal of success/error any*
	};

	const handleDelete = async () => {
		await deleteProduct({
			variables: {
				id: productId,
			},
		});
		if (selectProductRef.current) selectProductRef.current.selectedIndex = 0;
		if (selectCompanyRef.current) selectCompanyRef.current.selectedIndex = 0;
		if (selectCategoryRef.current) selectCategoryRef.current.selectedIndex = 0;
		await refetch();
		setValues(defaultValues);
		setProductId(0);
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
							onChange={handleProductSelect}
							ref={selectProductRef}
						>
							<option key={"product_upsert-0"} value={0}>
								{"Create new Product"}
							</option>
							{productData &&
								productData.products?.map((elem) => (
									<option key={`product_upsert-${elem.id}`} value={elem.id}>
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
					{jsonError && <Alert variant="danger">Invalid Json</Alert>}
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
				<Form.Select
					aria-label="Select Company"
					className="mt-3 mb-3 d-flex gap-2"
					name="company_id"
					onChange={handleChange}
					ref={selectCompanyRef}
				>
					<option key={0} value={0}>
						{"Choose company"}
					</option>
					{companyData &&
						companyData.companies?.map((elem) => (
							<option key={`company-${elem.id}`} value={elem.id}>
								{elem.name}
							</option>
						))}
				</Form.Select>
				<Form.Group className="mt-3 mb-3 d-flex gap-2">
					{categoryError && (
						<Alert variant="danger">{categoryError.message}</Alert>
					)}
					<Form.Select
						aria-label="Select Category"
						name="category_id"
						onChange={handleChange}
						ref={selectCategoryRef}
					>
						<option key={0} value={0}>
							{"Choose category"}
						</option>
						{categoryData &&
							categoryData.categories?.map((elem) => (
								<option key={`pcategory-${elem.id}`} value={elem.id}>
									{elem.name}
								</option>
							))}
					</Form.Select>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Images</Form.Label>
					<Form.Control
						type="file"
						accept="image/*"
						multiple
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

export default CreateProduct;
