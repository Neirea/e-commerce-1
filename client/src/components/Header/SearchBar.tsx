import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";

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
				<Button variant="success" id="btn-search" type="submit">
					Search
				</Button>
			</InputGroup>
		</Form>
	);
};

export default SearchBar;
