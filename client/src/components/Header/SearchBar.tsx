import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

const SearchBar = () => {
	return (
		<InputGroup style={{ width: "40rem" }}>
			<FormControl
				placeholder="Search..."
				aria-label="Search"
				aria-describedby="btn-search"
			/>
			<Button variant="btn btn-success" id="btn-search">
				Search
			</Button>
		</InputGroup>
	);
};

export default SearchBar;
