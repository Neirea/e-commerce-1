import { useMutation } from "@apollo/client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAppContext } from "../../context/AppContext";
import { MUTATION_LOGOUT } from "../../queries/User";

const UserMenu = ({ user }: { user: any }) => {
	const { refetchUser } = useAppContext();
	const [handleLogout, { error }] = useMutation(MUTATION_LOGOUT);
	return (
		<Navbar variant="dark" bg="dark" expand="lg">
			<Container fluid>
				<Navbar.Toggle aria-controls="user-navmenu" />
				<Navbar.Collapse id="user-navmenu">
					<Nav>
						<NavDropdown
							id="nav-dropdown-dark-example"
							title={user.given_name}
							menuVariant="dark"
						>
							<NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
							<NavDropdown.Item href="/orders">My Orders</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item
								onClick={async () => {
									await handleLogout();
									await refetchUser();
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
