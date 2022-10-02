import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useState, useRef } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import Cart from "../Cart";
import Login from "../Login";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { GetAllCategoriesQuery } from "../../generated/graphql";
import { QUERY_ALL_CATEGORIES } from "../../queries/Category";
import { useQuery } from "@apollo/client";
import Categories from "./Categories";
import { useOutsideClick } from "../../utils/useOutsideClick";

const Header = () => {
	const { user } = useAppContext();
	const { data, error, loading } =
		useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);

	const [showLogin, setShowLogin] = useState(false);
	const [showCart, setShowCart] = useState(false);
	const [showCategories, setShowCategories] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement | null>(null);

	// Categories Menu
	const handleShowCategories = () => setShowCategories(true);
	const handleCloseCategories = () => setShowCategories(false);
	const toggleCategories = () => setShowCategories((old) => !old);
	useOutsideClick(menuButtonRef, setShowCategories);

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
					Techway
				</Navbar.Brand>
				<Button
					variant="secondary"
					onClick={toggleCategories}
					ref={menuButtonRef}
				>
					Browse
				</Button>
				{/* create portal and menu that pops up from left side of the screen */}
				<Categories
					categories={data?.categories}
					handleClose={handleCloseCategories}
					show={showCategories}
				/>
				<SearchBar />
				<Nav className="d-flex align-items-center">
					{user ? (
						<UserMenu />
					) : (
						<Nav.Link onClick={handleShowLogin}>Login</Nav.Link>
					)}
					<Login handleClose={handleCloseLogin} show={showLogin} />
					{/* make this link look like button aboove */}
					<Nav.Link onClick={handleShowCart} aria-label="open cart">
						<BiCart size={24} />
					</Nav.Link>
					<Cart handleClose={handleCloseCart} show={showCart} />
				</Nav>
			</Container>
		</Navbar>
	);
};

export default Header;
