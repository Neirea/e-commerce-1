import { useQueryClient } from "@tanstack/react-query";
import type { JSX } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router";
import useCurrentUser from "../../hooks/useCurrentUser";
import { logout } from "../../queries/User";
import type { TRole } from "../../types/User";

const UserMenu = (): JSX.Element => {
    const { user } = useCurrentUser();
    const queryCient = useQueryClient();

    const editorRoles: TRole[] = ["ADMIN", "EDITOR"];

    const isShowEditor =
        user && editorRoles.some((role) => user.role.includes(role));

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
                        onClick={() => {
                            void logout()
                                .then(() =>
                                    queryCient.invalidateQueries({
                                        queryKey: ["me"],
                                    }),
                                )
                                .catch();
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
