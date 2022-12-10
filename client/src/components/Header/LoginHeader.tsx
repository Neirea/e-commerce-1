import { useState } from "react";
import { Nav } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import Login from "../Login";
import UserMenu from "./UserMenu";

const LoginHeader = () => {
    const { user, isLoading } = useAppContext();

    const [showLogin, setShowLogin] = useState(false);

    // Login Modal
    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    return (
        <>
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
        </>
    );
};

export default LoginHeader;
