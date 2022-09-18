import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import Cart from "../Cart";
import Login from "../Login";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const Header = () => {
	const { user } = useAppContext();

	const [showLogin, setShowLogin] = useState(false);
	const [showCart, setShowCart] = useState(false);
	// Login Modal
	const handleShowLogin = () => setShowLogin(true);
	const handleCloseLogin = () => setShowLogin(false);

	// Cart Modal
	const handleShowCart = () => setShowCart(true);
	const handleCloseCart = () => setShowCart(false);

	// Open User Menu
	const handleOpenUserMenu = () => {};

	return (
		<Navbar bg="dark" variant="dark">
			<Container className="d-flex">
				<Navbar.Brand href="/" className="d-none d-lg-block">
					Techway
				</Navbar.Brand>
				<SearchBar />
				<Nav className="d-flex align-items-center">
					{user ? (
						<UserMenu />
					) : (
						<Nav.Link onClick={user ? handleOpenUserMenu : handleShowLogin}>
							Login
						</Nav.Link>
					)}
					<Login handleClose={handleCloseLogin} show={showLogin} />
					{/* make this link look like button aboove */}
					<Nav.Link onClick={handleShowCart}>
						<BiCart size={"1.5rem"} />
					</Nav.Link>
					<Cart handleClose={handleCloseCart} show={showCart} />
				</Nav>
			</Container>
		</Navbar>
	);
};

export default Header;
