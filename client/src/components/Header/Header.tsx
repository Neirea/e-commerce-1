import { Container, Nav, Navbar } from "react-bootstrap";
import CartHeader from "./CartHeader";
import CategoriesHeader from "./CategoriesHeader";
import LoginHeader from "./LoginHeader";
import SearchBar from "./SearchBar";

const Header = () => {
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
                <CategoriesHeader />
                <SearchBar />
                <Nav className="d-flex align-items-center">
                    <LoginHeader />
                    <CartHeader />
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
