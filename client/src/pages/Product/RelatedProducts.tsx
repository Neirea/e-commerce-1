import { useApolloClient, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ProductsGrid from "../../components/ProductsGrid";
import {
	GetRelatedProductsQuery,
	GetSingleProductQuery,
} from "../../generated/graphql";
import { QUERY_RELATED_PRODUCTS } from "../../queries/Product";
import { FETCH_NUMBER } from "../../utils/numbers";

const RelatedProducts = ({
	product,
}: {
	product: GetSingleProductQuery["product"];
}) => {
	const {
		data: relatedProductData,
		loading: relatedProductLoading,
		error: relatedProductError,
		fetchMore,
	} = useQuery<GetRelatedProductsQuery>(QUERY_RELATED_PRODUCTS, {
		variables: {
			offset: 0,
			limit: FETCH_NUMBER,
			input: {
				id: product?.id,
				company_id: product?.company.id,
				category_id: product?.category.id,
			},
		},
	});
	const [showMore, setShowMore] = useState(true);
	const { cache } = useApolloClient();

	const fetchMoreProducts = async () => {
		const fetchedMore = await fetchMore({
			variables: {
				offset: relatedProductData?.relatedProducts.length,
				limit: FETCH_NUMBER,
				input: {
					id: product?.id,
					company_id: product?.company.id,
					category_id: product?.category.id,
				},
			},
		});
		if (fetchedMore.data.relatedProducts.length < FETCH_NUMBER)
			setShowMore(false);
	};

	useEffect(() => {
		return () => {
			if (product?.id) {
				cache.evict({ id: "ROOT_QUERY", fieldName: "relatedProducts" });
			}
		};
	}, [product?.id]);

	return (
		<div>
			<ProductsGrid
				products={relatedProductData?.relatedProducts}
				productLoading={relatedProductLoading}
				productError={relatedProductError}
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
		</div>
	);
};

export default RelatedProducts;
