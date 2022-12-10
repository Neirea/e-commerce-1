import { Container, Nav, Navbar } from "react-bootstrap";
import CartHeader from "./Cart";
import CategoriesHeader from "./Categories";
import LoginHeader from "./Login";
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
