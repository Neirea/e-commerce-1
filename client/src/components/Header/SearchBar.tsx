import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "@react-icons/all-files/bs/BsSearch";
import { useLazyQuery } from "@apollo/client";
import { QUERY_SEARCH_BAR } from "../../queries/Product";
import { GetSearchResultsQuery } from "../../generated/graphql";
import { useOutsideClick } from "../../utils/useOutsideClick";
import Loading from "../Loading";

const SearchBar = () => {
    const [searchText, setSearchText] = useState("");
    const [showResults, setShowResults] = useState(true);
    const navigate = useNavigate();
    const [getSearchResults, { data, loading, previousData }] =
        useLazyQuery<GetSearchResultsQuery>(QUERY_SEARCH_BAR, {
            variables: { input: searchText },
        });
    const searchBarRef = useRef<HTMLInputElement>(null);

    const searchData = data ?? previousData;

    const showSearchData =
        searchData &&
        showResults &&
        searchData.searchBarQuery.categories.length +
            searchData.searchBarQuery.companies.length +
            searchData.searchBarQuery.products.length >
            0;

    useOutsideClick([searchBarRef], () => setShowResults(false));

    const handleSearchText = (e: ChangeEvent<HTMLInputElement>) => {
        setShowResults(true);
        setSearchText(e.target.value);
        if (e.target.value.length) {
            getSearchResults({ variables: { input: e.target.value } });
        }
    };
    const search = (e: FormEvent) => {
        e.preventDefault();
        if (!searchText) return;
        navigate(`/search?v=${searchText}`);
    };
    return (
        <section style={{ position: "relative", width: "40rem" }}>
            <Form onSubmit={search}>
                <InputGroup>
                    <Form.Control
                        className="flex-grow-1"
                        placeholder="Search..."
                        onChange={handleSearchText}
                        aria-label="Search"
                        aria-describedby="btn-search"
                        title="Separate with ',' to search for multiple queries"
                        ref={searchBarRef}
                    />
                    <Button
                        variant="success"
                        id="btn-search"
                        type="submit"
                        aria-label="Search Button"
                    >
                        <BsSearch size={24} />
                    </Button>
                </InputGroup>
            </Form>
            {/* Search Results */}
            <div className="position-absolute mt-3 border-bottom border-start border-end border-secondary rounded-bottom bg-white w-100">
                {loading && (
                    <div className="d-flex justify-content-start gap-2 p-2 border-bottom">
                        <Loading size={1} />
                        <span>Loading ...</span>
                    </div>
                )}
                {showSearchData && (
                    <>
                        {searchData.searchBarQuery.categories.map((item) => {
                            return (
                                <Link
                                    key={item.id}
                                    to={`/search?c=${item.id}`}
                                    className="text-decoration-none search-link"
                                >
                                    <span className="custom-link">
                                        {item.name}
                                    </span>
                                    <span className="text-secondary opacity-75">
                                        {" - Category"}
                                    </span>
                                </Link>
                            );
                        })}
                        {searchData.searchBarQuery.companies.map((item) => {
                            return (
                                <Link
                                    key={item.id}
                                    to={`/search?b=${item.id}`}
                                    className="text-decoration-none search-link"
                                >
                                    <span className="custom-link">
                                        {item.name}
                                    </span>
                                    <span className="text-secondary opacity-75">
                                        {" - Company"}
                                    </span>
                                </Link>
                            );
                        })}
                        {searchData.searchBarQuery.products.map((item) => {
                            return (
                                <Link
                                    key={item.id}
                                    to={`/product/${item.id}`}
                                    className="text-decoration-none search-link"
                                >
                                    <span className="custom-link">
                                        {item.name}
                                    </span>
                                    <span className="text-secondary opacity-75">
                                        {" - Product"}
                                    </span>
                                </Link>
                            );
                        })}
                    </>
                )}
            </div>
        </section>
    );
};

export default SearchBar;
