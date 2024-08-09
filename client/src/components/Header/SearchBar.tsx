import { BsSearch } from "@react-icons/all-files/bs/BsSearch";
import qs from "query-string";
import {
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { getSearchBarData } from "../../queries/Product";
import type { TSearchResult } from "../../types/Product";
import LoadingSpinner from "../LoadingSpinner";

const SearchBar = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = qs.parse(search).v as string | null;
    const [searchText, setSearchText] = useState(query || "");
    const debouncedText = useDebounce(searchText, 300);
    const [searchData, setSearchData] = useState<TSearchResult[]>();
    const [searchLoading, setSearchLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchBarRef = useRef<HTMLInputElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const showSearchData = searchText && searchData && searchData.length > 0;

    useOutsideClick([searchBarRef], () => setShowResults(false));

    useEffect(() => {
        (async () => {
            if (debouncedText && debouncedText === searchText) {
                setSearchLoading(true);
                const { data } = await getSearchBarData(debouncedText);
                setSearchData(data);
                setSearchLoading(false);
                setSelectedIndex(null);
            }
        })();
    }, [debouncedText]);

    const handleSearchText = (e: ChangeEvent<HTMLInputElement>) => {
        setShowResults(true);
        setSearchText(e.target.value);
    };
    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (!searchText) return;
        setSelectedIndex(null);
        if (selectedIndex === null) {
            navigate(`/search?v=${searchText}`);
        } else if (searchData) {
            const destination = {
                Company: `/search?b=${searchData[selectedIndex].id}`,
                Category: `/search?c=${searchData[selectedIndex].id}`,
                Product: `/product/${searchData[selectedIndex].id}`,
            };
            navigate(destination[searchData[selectedIndex].source]);
        }
    };

    const handleArrowNavigation = (e: React.KeyboardEvent<HTMLElement>) => {
        if (!searchData) return;
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex === null || prevIndex === 0
                    ? searchData.length - 1
                    : prevIndex - 1
            );
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex === null || prevIndex === searchData.length - 1
                    ? 0
                    : prevIndex + 1
            );
        }
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
                        onKeyDown={handleArrowNavigation}
                        tabIndex={0}
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
                <div
                    className="d-none d-sm-block position-absolute mt-3 border-bottom border-start border-end border-secondary rounded-bottom bg-white w-100"
                    onKeyDown={handleArrowNavigation}
                    tabIndex={0}
                >
                    {searchLoading && (
                        <div className="d-flex justify-content-start gap-2 p-2">
                            <LoadingSpinner />
                            <span>Loading ...</span>
                        </div>
                    )}
                    {showSearchData && (
                        <>
                            {searchData.map((item, idx) => {
                                const link =
                                    item.source === "Category"
                                        ? `/search?c=${item.id}`
                                        : item.source === "Company"
                                        ? `/search?b=${item.id}`
                                        : `/product/${item.id}`;
                                return (
                                    <Link
                                        key={`${item.source}-${item.id}`}
                                        to={link}
                                        className={`text-decoration-none text-dark search-link ${
                                            idx === selectedIndex &&
                                            "selected-link"
                                        }`}
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
