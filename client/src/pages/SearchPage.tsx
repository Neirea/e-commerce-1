import { useQuery } from "@apollo/client";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ProductsGrid from "../components/ProductsGrid";
import { GetFilteredProductsQuery } from "../generated/graphql";
import { QUERY_FILTERED_PRODUCTS } from "../queries/Product";
import useInView from "../utils/useInView";

const FETCH_NUMBER = 12;

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchValue = searchParams.get("value");
	const searchCategory = searchParams.get("category");
	const [sortBy, setSortBy] = useState(0);

	const {
		data: productData,
		loading: productLoading,
		error: productError,
		refetch,
		fetchMore,
	} = useQuery<GetFilteredProductsQuery>(QUERY_FILTERED_PRODUCTS, {
		variables: {
			offset: 0,
			limit: FETCH_NUMBER,
			input: { search_string: searchValue, sortMode: 0 },
		},
	});

	const { containerRef, isVisible } = useInView<HTMLDivElement>({
		root: null,
		rootMargin: "0px",
		treshold: 1.0,
	});

	const handleSort = async (e: ChangeEvent<HTMLSelectElement>) => {
		setSortBy(+e.target.value);
	};

	//refetch stuff
	useEffect(() => {
		(async () => {
			await refetch({
				input: { sortMode: sortBy, search_string: searchValue },
			});
		})();
	}, [sortBy, searchValue]);

	useEffect(() => {
		if (isVisible) {
			(async () => {
				await fetchMore({
					variables: {
						offset: productData?.filteredProducts.length,
						limit: FETCH_NUMBER,
						input: { sortMode: sortBy, search_string: searchValue },
					},
				});
			})();
		}
	}, [isVisible]);

	const getProductCount = (category_id: number) => {
		let count = 0;
		productData?.filteredProducts?.forEach((product) => {
			if (product.category.id === category_id) count++;
		});
		return count;
	};

	const sortedCategories = useMemo(() => {
		type Category =
			GetFilteredProductsQuery["filteredProducts"][number]["category"];
		type resultType = {
			elem: Category;
			depth: number;
		};

		const categoriesSet = new Set<Category>();
		productData?.filteredProducts.forEach((e) => {
			categoriesSet.add(e.category);
		});
		const categories = [...categoriesSet];
		if (!categories.length) return [];

		const orderByParents = (
			data: Category[],
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
	}, [productData?.filteredProducts]);

	return (
		<Container as="main">
			<h4 className="mb-3 mt-3">{`Results for «${searchValue}»`}</h4>
			<div className="d-flex justify-content-end align-items-center gap-3">
				<span>Sort by</span>
				<Form.Select
					className="w-auto"
					aria-label="Sort by"
					value={sortBy}
					onChange={handleSort}
				>
					<option value={0}>Most popular</option>
					<option value={1}>Price, low to high</option>
					<option value={2}>Price, high to low</option>
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
								<span className="text-muted">{` (${getProductCount(
									elem.id
								)})`}</span>
							</div>
						);
					})}
				</Col>

				<Col sm="10" className="mt-2">
					{productData?.filteredProducts.length === 0 && (
						<h2 className="text-center mt-5">
							Couldn't find any products with this search
						</h2>
					)}
					{productData?.filteredProducts && (
						<ProductsGrid
							products={productData.filteredProducts}
							productError={productError}
							productLoading={productLoading}
						/>
					)}
					<div ref={containerRef} />
				</Col>
			</Row>
		</Container>
	);
};

export default SearchPage;
