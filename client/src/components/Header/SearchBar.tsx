import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

const SearchBar = () => {
	return (
		<InputGroup style={{ width: "50%" }}>
			<FormControl
				placeholder="Search..."
				aria-label="Search"
				aria-describedby="btn-search"
			/>
			<Button variant="outline-secondary" id="btn-search">
				Search
			</Button>
		</InputGroup>
	);
};

export default SearchBar;
