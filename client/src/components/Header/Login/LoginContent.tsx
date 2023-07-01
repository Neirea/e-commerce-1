import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";
import { FaGoogle } from "@react-icons/all-files/fa/FaGoogle";
import { Button, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { serverUrl } from "../../../utils/server";

const LoginContent = ({
    handleClose,
    show,
}: {
    handleClose: () => void;
    show: boolean;
}) => {
    const { pathname, search } = useLocation();
    const fromUrl = pathname.length > 1 ? pathname.slice(1) + search : "";
    const handleLoginGoogle = async () => {
        window.open(
            `${serverUrl}/api/auth/google/login?path=${fromUrl}`,
            "_self"
        );
    };
    const handleLoginFacebook = async () => {
        window.open(
            `${serverUrl}/api/auth/facebook/login?path=${fromUrl}`,
            "_self"
        );
    };

    return (
        <Modal
            className="fade"
            size="sm"
            show={show}
            onHide={handleClose}
            centered
        >
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

export default LoginContent;
