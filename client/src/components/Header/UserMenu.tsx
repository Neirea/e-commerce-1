import { useApolloClient } from "@apollo/client";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";
import { Role } from "../../generated/graphql";
import { serverUrl } from "../../utils/server";

const UserMenu = () => {
    const { user } = useCurrentUser();
    const client = useApolloClient();

    const isShowEditor =
        user &&
        [Role.ADMIN, Role.EDITOR].some((role) => user.role.includes(role));

    return (
        <Navbar
            variant="dark"
            bg="dark"
            expand="lg"
            style={{ minWidth: "5rem" }}
        >
            <Navbar.Toggle aria-controls="user-navmenu" />
            <Navbar.Collapse
                id="user-navmenu"
                className="d-flex justify-content-end"
            >
                <NavDropdown
                    id="nav-dropdown-dark"
                    title={user?.given_name}
                    menuVariant="dark"
                >
                    <NavDropdown.Item as={Link} to="/profile">
                        My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orders">
                        My Orders
                    </NavDropdown.Item>
                    {isShowEditor && (
                        <NavDropdown.Item as={Link} to="/editor">
                            Editor
                        </NavDropdown.Item>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                        onClick={async () => {
                            await fetch(`${serverUrl}/api/auth/logout`, {
                                method: "DELETE",
                                credentials: "include",
                            });
                            await client.refetchQueries({
                                include: ["ShowCurrentUser"],
                            });
                        }}
                    >
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default UserMenu;
