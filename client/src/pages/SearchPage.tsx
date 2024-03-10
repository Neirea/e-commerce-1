import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import qs from "query-string";
import { ChangeEvent, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingProgress from "../components/LoadingProgress";
import MultiRangeSlider from "../components/MultiRangeSlider";
import ProductsGrid from "../components/ProductsGrid";
import useInView from "../hooks/useInView";
import { getFilteredProducts, getSearchData } from "../queries/Product";
import { ICategoryType } from "../types/Category";
import { IProductCatCom } from "../types/Product";
import { SEARCH_NUMBER } from "../utils/numbers";
import sortByParentId from "../utils/sortByParents";
import { getError } from "../utils/getError";

const options = { root: null, rootMargin: "0px", treshold: 1.0 };

const SearchPage = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sortRef = useRef<HTMLSelectElement | null>(null);
    const searchParams = qs.parse(search);
    const categoryParam = searchParams.c != null ? +searchParams.c : undefined;
    const sortParam =
        searchParams.sort != null ? +searchParams.sort : undefined;
    const companyParam = searchParams.b != null ? +searchParams.b : undefined;
    const minParam = searchParams.min != null ? +searchParams.min : undefined;
    const maxParam = searchParams.max != null ? +searchParams.max : undefined;

    const input = {
        search_string: searchParams.v,
        category_id: categoryParam,
        company_id: companyParam,
        min_price: minParam,
        max_price: maxParam,
    };
    // general data about search
    const { data: searchData } = useQuery({
        queryKey: ["search-data", search],
        queryFn: () => getSearchData(input),
    });

    const fetchParams = { ...input, sort_mode: sortParam };

    const {
        data: productData,
        isLoading: productLoading,
        error,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["filtered", search],
        queryFn: ({ pageParam = 0 }) =>
            getFilteredProducts({ fetchParams, pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.data.length % SEARCH_NUMBER !== 0) return;
            return allPages.length;
        },
        keepPreviousData: true,
    });

    const productError = getError(error);
    const isCurrentLoading = productData && searchData ? false : true;

    const initialValue: IProductCatCom[] = [];
    const products = productData?.pages.reduce(
        (arr, curr) => arr.concat(curr.data),
        initialValue
    );

    const categoriesData = searchData?.data
        ? sortByParentId<ICategoryType>(searchData.data.categories)
        : null;

    useEffect(() => {
        if (sortRef.current) {
            sortRef.current.value = sortParam?.toString() || "0";
        }
    }, [search]);

    const containerRef = useInView<HTMLDivElement>(
        options,
        fetchNextPage,
        hasNextPage
    );

    const handleSort = async (e: ChangeEvent<HTMLSelectElement>) => {
        navigate({
            pathname: "/search",
            search: qs.stringify({ ...searchParams, sort: e.target.value }),
        });
    };

    return (
        <Container as="main">
            <LoadingProgress isLoading={isCurrentLoading} />
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
                    {!!searchData?.data && (
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
                                        {searchData.data.companies.length >
                                            0 && (
                                            <div>
                                                <b>Companies:</b>
                                            </div>
                                        )}
                                        {searchData.data.companies.map(
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
                    {!!searchData?.data && (
                        <MultiRangeSlider
                            key={`${searchData.data.min}-${searchData.data.max}`}
                            max={searchData.data.max}
                            min={searchData.data.min}
                        />
                    )}
                </Col>

                <Col className="col-lg-10 mt-2">
                    {products?.length === 0 && (
                        <h2 className="text-center mt-5">
                            Couldn't find any products with this search
                        </h2>
                    )}
                    {!!products && (
                        <>
                            <ProductsGrid
                                products={products}
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
