import { useState } from "react";
import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { BsPersonFill } from "@react-icons/all-files/bs/BsPersonFill";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import SearchBar from "./SearchBar";
import Login from "../Login";

const Header = () => {
	const [showLogin, setShowLogin] = useState(false);
	const handleCloseLogin = () => setShowLogin(false);
	const handleShowLogin = () => setShowLogin(true);

	return (
		<Navbar bg="dark" variant="dark">
			<Container className="d-flex">
				<Navbar.Brand href="/" className="d-none d-lg-block">
					E-Commerce
				</Navbar.Brand>
				<SearchBar />
				<Nav>
					<Button variant="link" onClick={handleShowLogin}>
						<BsPersonFill size={"1.5rem"} />
					</Button>
					<Login handleClose={handleCloseLogin} show={showLogin} />
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
