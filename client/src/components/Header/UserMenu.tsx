import { useMutation } from "@apollo/client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Role } from "../../generated/graphql";
import { MUTATION_LOGOUT } from "../../queries/User";

const UserMenu = () => {
	const navigate = useNavigate();
	const { user } = useAppContext();
	const [handleLogout] = useMutation(MUTATION_LOGOUT);

	const isShowEditor =
		user && [Role.ADMIN, Role.EDITOR].some((role) => user.role.includes(role));

	return (
		<Navbar variant="dark" bg="dark" expand="lg">
			<Container fluid>
				<Navbar.Toggle aria-controls="user-navmenu" />
				<Navbar.Collapse id="user-navmenu">
					<Nav>
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
									await handleLogout({
										refetchQueries: ["ShowCurrentUserQuery"],
									});
									navigate(0);
								}}
							>
								Logout
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default UserMenu;
