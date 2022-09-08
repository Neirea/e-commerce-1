import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {
	CreateProductMutation,
	CreateProductMutationVariables,
	GetAllCategoriesQuery,
	GetAllCompaniesQuery,
} from "../../generated/graphql";
import { QUERY_ALL_CATEGORIES } from "../../queries/Category";
import { QUERY_ALL_COMPANIES } from "../../queries/Company";
import { MUTATION_CREATE_PRODUCT } from "../../queries/Product";

const CreateProduct = () => {
	const { data: companyData, loading: companyLoading } =
		useQuery<GetAllCompaniesQuery>(QUERY_ALL_COMPANIES);
	const { data: categoryData, loading: categoryLoading } =
		useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);
	const [createProduct, { error: createProductError }] = useMutation<
		CreateProductMutation,
		CreateProductMutationVariables
	>(MUTATION_CREATE_PRODUCT);
	const [loading, setLoading] = useState(false);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [values, setValues] = useState({
		name: "",
		description: "",
		price: 0,
		inventory: 0,
		company_id: 0,
		category_id: 0,
		shipping_cost: 0,
		discount: 0,
	});
	if (createProductError) console.log(createProductError);

	useEffect(() => {
		if (!selectedImages.length) {
			setPreviewImages([]);
			return;
		}
		const objUrls: string[] = [];
		selectedImages.map((image) => {
			objUrls.push(URL.createObjectURL(image));
		});
		setPreviewImages(objUrls);

		return () => {
			objUrls.map((url) => URL.revokeObjectURL(url));
		};
	}, [selectedImages, setPreviewImages]);

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
		setLoading(true);
		console.log("values=", values);

		try {
			const newProduct = {
				...values,
				description: JSON.parse(values.description),
				images: previewImages,
			};
			console.log(newProduct);
			console.log(typeof newProduct.company_id);

			await createProduct({ variables: { input: newProduct } });

			// mutation to create Product
		} catch (error) {}

		setLoading(false);
	};

	return (
		<>
			<h2 className="text-center mt-4">Create new Product</h2>
			<Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Name</Form.Label>
					<Form.Control
						type="text"
						name="name"
						placeholder="Product name"
						onChange={handleChange}
						value={values.name}
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
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Description</Form.Label>
					<Form.Control
						as="textarea"
						rows={7}
						name="description"
						onChange={handleChange}
						value={values.description}
						placeholder={`JSON of product description:\n{\n\tname:"Iphone 11",\n\tprice: 1000,\n\t ...\n}`}
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
					/>
				</Form.Group>
				<Form.Group className="mt-3 mb-3 d-flex gap-2">
					<Form.Select
						aria-label="Select Company"
						name="company_id"
						onChange={handleChange}
					>
						<option key={0} value={0}>
							{"Choose company"}
						</option>
						{companyData &&
							companyData.companies?.map((elem: any, idx: number) => (
								<option key={idx} value={elem.id}>
									{elem.name}
								</option>
							))}
					</Form.Select>
				</Form.Group>
				<Form.Group className="mt-3 mb-3 d-flex gap-2">
					<Form.Select
						aria-label="Select Category"
						name="category_id"
						onChange={handleChange}
					>
						<option key={0} value={0}>
							{"Choose category"}
						</option>
						{categoryData &&
							categoryData.categories?.map((elem: any, idx: number) => (
								<option key={idx} value={elem.id}>
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
				<div className="d-flex justify-content-center">
					<Button type="submit">{loading ? "Wait..." : "Submit"}</Button>
				</div>
			</Form>
		</>
	);
};

export default CreateProduct;
