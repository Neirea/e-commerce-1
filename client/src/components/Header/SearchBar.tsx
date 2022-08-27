import React from "react";
import { InputGroup, FormControl, Button, Form } from "react-bootstrap";

const SearchBar = () => {
	const search = () => {};
	return (
		<Form onSubmit={search} style={{ width: "40rem" }}>
			<InputGroup className="d-flex">
				<Form.Select
					className="d-block bg-light w-auto"
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
					aria-label="Search"
					aria-describedby="btn-search"
				/>
				<Button variant="btn btn-success" id="btn-search" type="submit">
					Search
				</Button>
			</InputGroup>
		</Form>
	);
};

export default SearchBar;
