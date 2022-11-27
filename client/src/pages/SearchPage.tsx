import { useQuery } from "@apollo/client";
import * as qs from "query-string";
import { ChangeEvent, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MultiRangeSlider from "../components/MultiRangeSlider";
import ProductsGrid from "../components/ProductsGrid";
import {
    GetFilteredProductsQuery,
    GetSearchDataQuery,
} from "../generated/graphql";
import { QUERY_FILTERED_PRODUCTS, QUERY_SEARCH_DATA } from "../queries/Product";
import useInView from "../utils/useInView";
import sortByParentId from "../utils/sortByParents";
import Loading from "../components/Loading";

const FETCH_NUMBER = 12;
type CategoryType = GetSearchDataQuery["searchData"]["categories"][number];

const SearchPage = () => {
    const navigate = useNavigate();
    const searchParams = qs.parse(location.search);
    const categoryParam = searchParams.c != null ? +searchParams.c : undefined;
    const sortParam =
        searchParams.sort != null ? +searchParams.sort : undefined;
    const companyParam = searchParams.b != null ? +searchParams.b : undefined;
    const minParam = searchParams.min != null ? +searchParams.min : undefined;
    const maxParam = searchParams.max != null ? +searchParams.max : undefined;

    //general data about search results
    const {
        data: searchData,
        loading: searchLoading,
        refetch: refetchData,
    } = useQuery<GetSearchDataQuery>(QUERY_SEARCH_DATA, {
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

    const { containerRef, isVisible } = useInView<HTMLDivElement>({
        root: null,
        rootMargin: "0px",
        treshold: 1.0,
    });

    //fetching if query string changes
    useEffect(() => {
        if (productData?.filteredProducts) {
            (async () => {
                //refetch if data already exists
                await refetch({
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
                });
            })();
        }
        if (searchData?.searchData) {
            //refetch if category changes
            (async () => {
                await refetchData({
                    input: {
                        search_string: searchParams.v,
                        category_id: categoryParam,
                        company_id: companyParam,
                        min_price: minParam,
                        max_price: maxParam,
                    },
                });
            })();
        }
    }, [location.search]);

    //fetch additional products if we didn't get max available products
    useEffect(() => {
        if (
            isVisible &&
            productData?.filteredProducts &&
            productData.filteredProducts.length % FETCH_NUMBER === 0
        ) {
            (async () => {
                await fetchMore({
                    variables: {
                        offset: productData.filteredProducts.length,
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
            })();
        }
    }, [isVisible]);

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
                                {sortByParentId<CategoryType>(
                                    searchData.searchData.categories
                                ).map(({ elem, depth }) => {
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
                                        {!!searchData.searchData.companies
                                            .length && (
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
                            key={
                                searchData.searchData.max -
                                searchData.searchData.min
                            }
                            max={searchData.searchData.max}
                            min={searchData.searchData.min}
                            curLeft={minParam}
                            curRight={maxParam}
                        />
                    )}
                </Col>

                <Col className="col-lg-10 mt-2">
                    {productData?.filteredProducts.length === 0 && (
                        <h2 className="text-center mt-5">
                            Couldn't find any products with this search
                        </h2>
                    )}
                    {searchLoading && !productData?.filteredProducts && (
                        <div className="mt-5">
                            <Loading />
                        </div>
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
                </Col>
            </Row>
        </Container>
    );
};

export default SearchPage;
