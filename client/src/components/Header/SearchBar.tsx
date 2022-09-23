import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button, Form } from "react-bootstrap";

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
			<InputGroup className="d-flex small">
				<Form.Select
					className="d-none d-md-block bg-light w-auto"
					style={{ flex: "0 0 auto" }}
					aria-label="select product category"
				>
					{/* categories list fetched */}
					<option value="#All">All</option>
					<option value="#Laptops">Laptops</option>
					<option value="#Phones">Phones</option>
					<option value="#PC">PC</option>
				</Form.Select>
				<FormControl
					className="flex-grow-1"
					placeholder="Search..."
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
