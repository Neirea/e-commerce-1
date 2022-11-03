import { useQuery } from "@apollo/client";
import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useRef, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import { useCartContext } from "../../context/CartContext";
import { GetAllCategoriesQuery } from "../../generated/graphql";
import { QUERY_ALL_CATEGORIES } from "../../queries/Category";
import { useOutsideClick } from "../../utils/useOutsideClick";
import Cart from "../Cart";
import Login from "../Login";
import Categories from "./Categories";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const Header = () => {
    const { user, isLoading } = useAppContext();
    const { cart } = useCartContext();
    const { data } = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);

    const [showLogin, setShowLogin] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const categoriesRef = useRef<HTMLDivElement | null>(null);

    const cartAmount = cart.reduce((prev, curr) => prev + curr.amount, 0);

    // Categories Menu
    const toggleCategories = () => setShowCategories((old) => !old);
    const handleCloseCategories = () => setShowCategories(false);

    // Login Modal
    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    // Cart Modal
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    useOutsideClick([menuButtonRef, categoriesRef], handleCloseCategories);

    return (
        <Navbar
            bg="dark"
            variant="dark"
            sticky="top"
            style={{ height: "70px" }}
        >
            <Container className="d-flex gap-2">
                <Navbar.Brand href="/" className="d-none d-lg-block">
                    Techway
                </Navbar.Brand>
                <Button
                    variant="secondary"
                    onClick={toggleCategories}
                    ref={menuButtonRef}
                >
                    Сatalog
                </Button>
                {/* create portal and menu that pops up from left side of the screen */}
                {!!showCategories && (
                    <Categories
                        categories={data?.categories}
                        handleClose={handleCloseCategories}
                        ref={categoriesRef}
                    />
                )}
                <SearchBar />
                <Nav className="d-flex align-items-center">
                    {user ? (
                        <UserMenu />
                    ) : (
                        <Nav.Link
                            onClick={handleShowLogin}
                            style={{ minWidth: "5rem" }}
                            className="d-flex justify-content-end"
                        >
                            {isLoading ? "" : "Login"}
                        </Nav.Link>
                    )}
                    <Login handleClose={handleCloseLogin} show={showLogin} />
                    {/* make this link look like button aboove */}
                    <Nav.Link
                        onClick={handleShowCart}
                        aria-label="open cart"
                        className="position-relative"
                    >
                        <BiCart size={24} />
                        {!!cartAmount && (
                            <div className="cart-amount">{cartAmount}</div>
                        )}
                    </Nav.Link>
                    <Cart handleClose={handleCloseCart} show={showCart} />
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
