import { useLazyQuery } from "@apollo/client";
import { BsSearch } from "@react-icons/all-files/bs/BsSearch";
import qs from "query-string";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GetSearchResultsQuery } from "../../generated/graphql";
import { useDebounce } from "../../hooks/useDebounce";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { QUERY_SEARCH_BAR } from "../../queries/Product";
import LoadingSpinner from "../LoadingSpinner";

const SearchBar = () => {
    const { search } = useLocation();
    const query = qs.parse(search).v as string | null;
    const [searchText, setSearchText] = useState(query || "");
    const debouncedText = useDebounce(searchText, 300);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const [getSearchResults, { data, loading, previousData }] =
        useLazyQuery<GetSearchResultsQuery>(QUERY_SEARCH_BAR);
    const searchBarRef = useRef<HTMLInputElement>(null);

    const searchData = data ?? previousData;
    const searchLoading =
        searchText && (loading || searchText !== debouncedText);

    const showSearchData =
        searchText && searchData && searchData.searchBarQuery.length > 0;

    useOutsideClick([searchBarRef], () => setShowResults(false));

    useEffect(() => {
        if (debouncedText && debouncedText === searchText) {
            getSearchResults({ variables: { input: debouncedText } });
        }
    }, [debouncedText]);

    const handleSearchText = (e: ChangeEvent<HTMLInputElement>) => {
        setShowResults(true);
        setSearchText(e.target.value);
    };
    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (!searchText) return;
        navigate(`/search?v=${searchText}`);
    };
    return (
        <section style={{ position: "relative", width: "40rem" }}>
            <Form onSubmit={handleSearch}>
                <InputGroup>
                    <Form.Control
                        type="search"
                        className="flex-grow-1"
                        placeholder="Search..."
                        value={searchText}
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
            {showResults && (
                <div className="d-none d-sm-block position-absolute mt-3 border-bottom border-start border-end border-secondary rounded-bottom bg-white w-100">
                    {searchLoading && (
                        <div className="d-flex justify-content-start gap-2 p-2">
                            <LoadingSpinner />
                            <span>Loading ...</span>
                        </div>
                    )}
                    {showSearchData && (
                        <>
                            {searchData.searchBarQuery.map((item) => {
                                return (
                                    <Link
                                        key={`${item.source}-${item.id}`}
                                        to={`/search?c=${item.id}`}
                                        className="text-decoration-none text-dark search-link"
                                    >
                                        {item.name}
                                        <span className="text-secondary opacity-75">
                                            {` - ${item.source}`}
                                        </span>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </section>
    );
};

export default SearchBar;
