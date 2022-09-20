import { Container, Row, Col, Form, Image, Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useQuery } from "@apollo/client";
import { GetAllCategoriesQuery } from "../generated/graphql";
import { QUERY_ALL_CATEGORIES } from "../queries/Category";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchValue = searchParams.get("value");
	const searchCategory = searchParams.get("category");

	const {
		data: categoryData,
		loading: categoryLoading,
		error: categoryError,
	} = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);

	const sortedCategories = useMemo(() => {
		const categories = categoryData?.categories;
		if (categories == null) return [];

		type Categories = GetAllCategoriesQuery["categories"];
		type resultType = {
			elem: GetAllCategoriesQuery["categories"][number];
			depth: number;
		};

		const orderByParents = (
			data: Categories,
			depth: number,
			p_id?: number | undefined
		) => {
			if (p_id !== undefined) depth++;
			return data.reduce((r: resultType[], e) => {
				//check if element is parent to any element
				if (p_id == e.parent_id) {
					//push element
					r.push({ elem: e, depth });
					//push its children after
					r.push(...orderByParents(data, depth, e.id));
				}
				return r;
			}, []);
		};

		return orderByParents(categories, 0);
	}, [categoryData?.categories]);

	return (
		<Container as="main">
			<h4 className="mb-3 mt-3">{`Results for «${searchValue}»`}</h4>
			<div className="d-flex justify-content-end align-items-center gap-3">
				<span>Sort by</span>
				<Form.Select className="w-auto" aria-label="Sort by">
					<option>Most popular</option>
					<option>Price, low to high</option>
					<option>Price, high to low</option>
				</Form.Select>
			</div>
			<Row className="border-top mt-2">
				<Col sm="2" className="border-end">
					{sortedCategories.map(({ elem, depth }) => {
						return (
							<div
								className="mt-2"
								style={{ paddingLeft: `${depth * 7.5}%` }}
								key={uuidv4()}
							>
								<Link className="custom-link" to={`/seach?category=${elem.id}`}>
									{elem.name}
								</Link>
								<span className="text-muted">{` (${elem._count.products})`}</span>
							</div>
						);
					})}
				</Col>

				<Col sm="10">
					{/* <div className="vr" /> */}
					<Row>
						<Col sm="3" className="border-bottom border-end">
							<Image
								fluid={true}
								src="https://content1.rozetka.com.ua/goods/images/big_tile/37361699.jpg"
								alt="Product name"
							/>
							<div>Product name</div>
							<div>Rating</div>
							<Row className="d-flex align-items-center">
								{/* Crossed out price if discount */}
								<Col as="h5" sm="8">
									Price $
								</Col>
								<Col sm="4">
									<Button variant="link" className="link-success">
										{/* Filled in icon(or dif color) if it's in cart */}
										<BiCart size={"2rem"} />
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default SearchPage;
