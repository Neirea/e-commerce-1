import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";
import { FaGoogle } from "@react-icons/all-files/fa/FaGoogle";
import { Button, Modal } from "react-bootstrap";

const Login = ({
	handleClose,
	show,
}: {
	handleClose: () => void;
	show: boolean;
}) => {
	const handleLoginGoogle = async () => {
		// window.open(
		// 	`${process.env.REACT_APP_SERVER_URL}/api/auth/login/github?path=${fromUrl}`,
		// 	"_self"
		// );
	};
	const handleLoginFacebook = async () => {
		// ........
	};

	return (
		<Modal className="fade" size="sm" show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Sign in with</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Button variant="danger" className="d-block w-100 mb-2">
					<FaGoogle /> Google
				</Button>
				<Button variant="primary" className="d-block w-100 mb-2">
					<FaFacebook /> Facebook
				</Button>
			</Modal.Body>
		</Modal>
	);
};

export default Login;
