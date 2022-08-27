import React from "react";
import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import SearchBar from "./SearchBar";

const Header = () => {
	return (
		<Navbar bg="dark" variant="dark">
			<Container className="d-flex">
				<Navbar.Brand href="/" className="d-none d-lg-block">
					E-Commerce
				</Navbar.Brand>
				<SearchBar />
				<Nav>
					<Nav.Link href="#dmode">DMode</Nav.Link>
					<Nav.Link href="#user">User</Nav.Link>
					<Nav.Link href="#cart">
						<BiCart size={"1.5rem"} />
					</Nav.Link>
				</Nav>
				{/* </Navbar.Collapse> */}
			</Container>
		</Navbar>
	);
};

export default Header;
