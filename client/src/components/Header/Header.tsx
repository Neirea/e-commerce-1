import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
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
					E-Commerce
				</Navbar.Brand>
				<SearchBar />
				<Nav>
					{user && <p>{user.given_name}</p>}
					{user ? (
						<UserMenu user={user} />
					) : (
						<Button
							variant="link"
							className="link-secondary shadow-none"
							onClick={user ? handleOpenUserMenu : handleShowLogin}
						>
							Login
						</Button>
					)}
					<Login handleClose={handleCloseLogin} show={showLogin} />
					{/* make this link look like button aboove */}
					<Button
						variant="link"
						className="link-secondary shadow-none"
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