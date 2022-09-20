import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import ProductsGrid from "../../components/ProductsGrid";
import { GetPopularProductsQuery } from "../../generated/graphql";
import { QUERY_POPULAR_PRODUCTS } from "../../queries/Product";
import { FETCH_NUMBER } from "../../utils/numbers";

const Popular = () => {
	const {
		data: productData,
		loading: productLoading,
		error: productError,
		fetchMore,
	} = useQuery<GetPopularProductsQuery>(QUERY_POPULAR_PRODUCTS, {
		variables: { limit: FETCH_NUMBER, offset: 0 },
	});
	const [showMore, setShowMore] = useState(true);

	const fetchMoreProducts = async () => {
		const fetchedMore = await fetchMore({
			variables: {
				offset: productData?.popularProducts.length,
				limit: FETCH_NUMBER,
			},
		});
		if (fetchedMore.data.popularProducts.length < FETCH_NUMBER)
			setShowMore(false);
	};

	return (
		<Container as="section" className="mt-3 gap-3">
			<h2 className="text-center mt-5 mb-5">Popular</h2>

			<ProductsGrid
				products={productData?.popularProducts}
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

export default Popular;
