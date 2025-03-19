import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";
import { FaGoogle } from "@react-icons/all-files/fa/FaGoogle";
import type { JSX } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { serverUrl } from "../../../utils/server";

const LoginContent = ({
    handleClose,
    show,
}: {
    handleClose: () => void;
    show: boolean;
}): JSX.Element => {
    const handleLoginGoogle = (): void => {
        window.open(`${serverUrl}/api/auth/google/login`, "_self");
    };
    const handleLoginFacebook = (): void => {
        window.open(`${serverUrl}/api/auth/facebook/login`, "_self");
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
