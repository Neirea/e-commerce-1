import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import CartHeader from "./Cart";
import CategoriesHeader from "./Categories";
import LoginHeader from "./Login";
import SearchBar from "./SearchBar";

const Header = (): JSX.Element => {
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
