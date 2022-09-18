import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import ProductsGrid from "../../components/ProductsGrid";
import { GetFeaturedProductsQuery } from "../../generated/graphql";
import { QUERY_FEATURED_PRODUCTS } from "../../queries/Product";

const FETCH_NUMBER = 5;

const Featured = () => {
	const {
		data: productData,
		loading: productLoading,
		error: productError,
		fetchMore,
	} = useQuery<GetFeaturedProductsQuery>(QUERY_FEATURED_PRODUCTS, {
		variables: { limit: FETCH_NUMBER, offset: 0 },
	});
	const [showMore, setShowMore] = useState(true);

	const fetchMoreProducts = async () => {
		await fetchMore({
			variables: {
				offset: productData?.featuredProducts.length,
				limit: FETCH_NUMBER,
			},
			updateQuery(prev, { fetchMoreResult }) {
				if (!fetchMoreResult.featuredProducts.length) {
					setShowMore(false);
					return prev;
				}
				if (fetchMoreResult.featuredProducts.length < FETCH_NUMBER) {
					setShowMore(false);
				}
				return Object.assign({}, prev, {
					featuredProducts: [
						...prev.featuredProducts,
						...fetchMoreResult.featuredProducts,
					],
				});
			},
		});
	};

	return (
		<Container className="mt-3 gap-3">
			<h2 className="text-center mt-5 mb-5">Featured</h2>
			<ProductsGrid
				products={productData?.featuredProducts}
				productLoading={productLoading}
				productError={productError}
			/>
			{showMore && (
				<div className="text-center mt-3">
					<Button
						size="lg"
						variant={"outline-success"}
						className="w-25 fs-6"
						onClick={fetchMoreProducts}
					>
						Load More
					</Button>
				</div>
			)}
		</Container>
	);
};

export default Featured;
