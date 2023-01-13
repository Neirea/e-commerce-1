import { useState } from "react";
import { Nav } from "react-bootstrap";
import useCurrentUser from "../../../hooks/useCurrentUser";
import LoginContent from "./LoginContent";
import UserMenu from "../UserMenu";

const Login = () => {
    const { user, isLoading } = useCurrentUser();

    const [showLogin, setShowLogin] = useState(false);

    // Login Modal
    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    if (isLoading) {
        return <div style={{ minWidth: "5rem" }} />;
    }
    if (user) {
        return <UserMenu />;
    }
    return (
        <>
            <Nav.Link
                onClick={handleShowLogin}
                style={{ minWidth: "5rem" }}
                className="d-flex justify-content-end"
            >
                {isLoading ? "" : "Login"}
            </Nav.Link>
            <LoginContent handleClose={handleCloseLogin} show={showLogin} />
        </>
    );
};

export default Login;
