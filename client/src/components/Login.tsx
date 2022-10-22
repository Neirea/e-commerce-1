import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";
import { FaGoogle } from "@react-icons/all-files/fa/FaGoogle";
import { Button, Modal } from "react-bootstrap";
import { serverUrl } from "../utils/server";

const Login = ({
	handleClose,
	show,
}: {
	handleClose: () => void;
	show: boolean;
}) => {
	const fromUrl =
		window.location.pathname.length > 1
			? window.location.pathname.slice(1) + window.location.search
			: "";
	const handleLoginGoogle = async () => {
		window.open(`${serverUrl}/api/auth/login/google?path=${fromUrl}`, "_self");
	};
	const handleLoginFacebook = async () => {
		window.open(
			`${serverUrl}/api/auth/login/facebook?path=${fromUrl}`,
			"_self"
		);
	};

	return (
		<Modal className="fade" size="sm" show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Sign in with</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Button
					variant="danger"
					className="d-block w-100 mb-2"
					onClick={handleLoginGoogle}
				>
					<FaGoogle /> Google
				</Button>
				<Button
					variant="primary"
					className="d-block w-100 mb-2"
					onClick={handleLoginFacebook}
				>
					<FaFacebook /> Facebook
				</Button>
			</Modal.Body>
		</Modal>
	);
};

export default Login;
