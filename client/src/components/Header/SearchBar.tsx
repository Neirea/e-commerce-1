import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "@react-icons/all-files/bs/BsSearch";

const SearchBar = () => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const handleSearchText = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const search = (e: FormEvent) => {
        e.preventDefault();
        if (!searchText) return;
        navigate(`/search?v=${searchText}`);
    };
    return (
        <Form onSubmit={search} style={{ width: "40rem" }}>
            <InputGroup>
                <Form.Control
                    className="flex-grow-1"
                    placeholder="Look for..."
                    onChange={handleSearchText}
                    aria-label="Search"
                    aria-describedby="btn-search"
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
    );
};

export default SearchBar;
