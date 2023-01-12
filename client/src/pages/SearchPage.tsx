import { useQuery } from "@apollo/client";
import qs from "query-string";
import { ChangeEvent, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import MultiRangeSlider from "../components/MultiRangeSlider";
import ProductsGrid from "../components/ProductsGrid";
import {
    GetFilteredProductsQuery,
    GetSearchDataQuery,
} from "../generated/graphql";
import { QUERY_FILTERED_PRODUCTS, QUERY_SEARCH_DATA } from "../queries/Product";
import sortByParentId from "../utils/sortByParents";
import useInView from "../hooks/useInView";

const FETCH_NUMBER = 12;
type CategoryType = GetSearchDataQuery["searchData"]["categories"][number];

const options = { root: null, rootMargin: "0px", treshold: 1.0 };

const SearchPage = () => {
    const navigate = useNavigate();
    const [hasMore, setHasMore] = useState(0); //number of pages, 0 - stop fetchingMore
    const { search } = useLocation();
    const sortRef = useRef<HTMLSelectElement | null>(null);
    const searchParams = qs.parse(search);
    const categoryParam = searchParams.c != null ? +searchParams.c : undefined;
    const sortParam =
        searchParams.sort != null ? +searchParams.sort : undefined;
    const companyParam = searchParams.b != null ? +searchParams.b : undefined;
    const minParam = searchParams.min != null ? +searchParams.min : undefined;
    const maxParam = searchParams.max != null ? +searchParams.max : undefined;

    //general data about search results
    const { data: searchData, loading: searchLoading } =
        useQuery<GetSearchDataQuery>(QUERY_SEARCH_DATA, {
            variables: {
                input: {
                    search_string: searchParams.v,
                    category_id: categoryParam,
                    company_id: companyParam,
                    min_price: minParam,
                    max_price: maxParam,
                },
            },
        });

    const categoriesData = searchData?.searchData
        ? sortByParentId<CategoryType>(searchData.searchData.categories)
        : null;

    const {
        data: productData,
        previousData,
        loading: productLoading,
        error: productError,
        fetchMore,
    } = useQuery<GetFilteredProductsQuery>(QUERY_FILTERED_PRODUCTS, {
        variables: {
            offset: 0,
            limit: FETCH_NUMBER,
            input: {
                search_string: searchParams.v,
                sortMode: sortParam,
                category_id: categoryParam,
                company_id: companyParam,
                min_price: minParam,
                max_price: maxParam,
            },
        },
        notifyOnNetworkStatusChange: true,
        onCompleted(data) {
            if (sortRef.current) {
                sortRef.current.value = sortParam?.toString() || "0";
            }
            if (
                data.filteredProducts.length % FETCH_NUMBER !== 0 ||
                previousData?.filteredProducts.length ===
                    data.filteredProducts.length
            ) {
                setHasMore(0);
                return;
            }
            setHasMore((prev) => prev + 1);
        },
    });

    const containerRef = useInView<HTMLDivElement>(
        options,
        async () => {
            await fetchMore({
                variables: {
                    offset: productData?.filteredProducts.length,
                    limit: FETCH_NUMBER,
                    input: {
                        search_string: searchParams.v,
                        sortMode: sortParam,
                        category_id: categoryParam,
                        company_id: companyParam,
                        min_price: minParam,
                        max_price: maxParam,
                    },
                },
            });
        },
        hasMore
    );

    const handleSort = async (e: ChangeEvent<HTMLSelectElement>) => {
        navigate({
            pathname: "/search",
            search: qs.stringify({ ...searchParams, sort: e.target.value }),
        });
    };

    return (
        <Container as="main">
            <h4 className="mb-3 mt-3">
                {searchParams.v
                    ? `Results for «${searchParams.v}»`
                    : "Results:"}
            </h4>
            <div className="d-flex justify-content-end align-items-center gap-3">
                <span>Sort by</span>
                <Form.Select
                    className="w-auto"
                    aria-label="Sort by"
                    onChange={handleSort}
                    ref={sortRef}
                >
                    <option value={0}>Most popular</option>
                    <option value={1}>Price, low to high</option>
                    <option value={2}>Price, high to low</option>
                </Form.Select>
            </div>

            <Row className="border-top mt-2 flex-column flex-lg-row">
                <Col className="col-lg-2 mb-5 pt-3 custom-border">
                    {!!searchData?.searchData && (
                        <>
                            <div>
                                <b>Categories:</b>
                            </div>
                            <div className="border-bottom pb-3">
                                {categoriesData?.map(({ elem, depth }) => {
                                    return (
                                        <div
                                            className="mt-2"
                                            style={{
                                                paddingLeft: `${depth * 7.5}%`,
                                            }}
                                            key={elem.id}
                                        >
                                            <Link
                                                className="custom-link text-primary"
                                                to={{
                                                    pathname: "/search",
                                                    search: qs.stringify({
                                                        ...searchParams,
                                                        c: elem.id,
                                                        b: undefined,
                                                    }),
                                                }}
                                            >
                                                {elem.name}
                                            </Link>
                                            {!!elem.productCount && (
                                                <span className="text-muted">{` (${elem.productCount})`}</span>
                                            )}
                                        </div>
                                    );
                                })}
                                {!!categoryParam && (
                                    <div className="pb-3 mt-2">
                                        {searchData.searchData.companies
                                            .length > 0 && (
                                            <div>
                                                <b>Companies:</b>
                                            </div>
                                        )}
                                        {searchData.searchData.companies.map(
                                            (elem) => {
                                                return (
                                                    <div
                                                        className="mt-2"
                                                        key={elem.id}
                                                    >
                                                        <Link
                                                            className="custom-link text-primary"
                                                            to={{
                                                                pathname:
                                                                    "/search",
                                                                search: qs.stringify(
                                                                    {
                                                                        ...searchParams,
                                                                        b: elem.id,
                                                                    }
                                                                ),
                                                            }}
                                                        >
                                                            {elem.name}
                                                        </Link>
                                                        <span className="text-muted">{` (${elem.productCount})`}</span>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {!!searchData?.searchData && !searchLoading && (
                        <MultiRangeSlider
                            key={search}
                            max={searchData.searchData.max}
                            min={searchData.searchData.min}
                        />
                    )}
                </Col>

                <Col className="col-lg-10 mt-2">
                    {productData?.filteredProducts.length === 0 && (
                        <h2 className="text-center mt-5">
                            Couldn't find any products with this search
                        </h2>
                    )}
                    {!!productData?.filteredProducts && (
                        <>
                            <ProductsGrid
                                products={productData.filteredProducts}
                                productError={productError}
                                productLoading={productLoading}
                            />
                            <div ref={containerRef} />
                        </>
                    )}
                    {searchLoading && !productData?.filteredProducts && (
                        <div className="mt-5">
                            <Loading />
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SearchPage;
