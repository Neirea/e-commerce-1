import React, { ChangeEvent, FormEvent, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

const CreateProduct = () => {
	const [loading, setLoading] = useState(false);
	const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.files);
	};
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			// mutation to create Product
		} catch (error) {}

		setLoading(false);
	};
	return (
		<Container as="main">
			<h2 className="text-center mt-4">Create new Product</h2>
			<Form className="m-auto col-sm-5" onSubmit={handleSubmit}>
				<Form.Group className="mt-3 mb-3">
					<Form.Label>Name</Form.Label>
					<Form.Control type="text" placeholder="Product name" />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Price</Form.Label>
					<Form.Control type="text" placeholder="Float number in USD" />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Description</Form.Label>
					<Form.Control
						as="textarea"
						rows={7}
						placeholder={`JSON of product description:\n{\n\tname:"Iphone 11",\n\tprice: 1000,\n\t ...\n}`}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Company</Form.Label>
					<Form.Control type="text" placeholder="Company name" />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Inventory</Form.Label>
					<Form.Control type="text" placeholder="Amount of available goods" />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Shipping cost</Form.Label>
					<Form.Control type="text" placeholder="Float number in USD" />
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Discount</Form.Label>
					<Form.Control
						type="text"
						placeholder="% number of base price discount"
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Category</Form.Label>
					<Form.Select aria-label="Select Product Category">
						<option>Category 1</option>
						<option value="1">Category 2</option>
						<option value="2">Category 3</option>
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
		</Container>
	);
};

export default CreateProduct;
