import { useState } from "react";
import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { BsPersonFill } from "@react-icons/all-files/bs/BsPersonFill";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import SearchBar from "./SearchBar";
import Login from "../Login";
import Cart from "../Cart";

const Header = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showCart, setShowCart] = useState(false);
	// Login Modal
	const handleShowLogin = () => setShowLogin(true);
	const handleCloseLogin = () => setShowLogin(false);

	// Cart Modal
	const handleShowCart = () => setShowCart(true);
	const handleCloseCart = () => setShowCart(false);

	return (
		<Navbar bg="dark" variant="dark">
			<Container className="d-flex">
				<Navbar.Brand href="/" className="d-none d-lg-block">
					E-Commerce
				</Navbar.Brand>
				<SearchBar />
				<Nav>
					<Button
						variant="link"
						className="link-secondary"
						onClick={handleShowLogin}
					>
						<BsPersonFill size={"1.5rem"} />
					</Button>
					<Login handleClose={handleCloseLogin} show={showLogin} />
					{/* make this link look like button aboove */}
					<Button
						variant="link"
						className="link-secondary"
						onClick={handleShowCart}
					>
						<BiCart size={"1.5rem"} />
					</Button>
					<Cart handleClose={handleCloseCart} show={showCart} />
				</Nav>
			</Container>
		</Navbar>
	);
};

export default Header;
