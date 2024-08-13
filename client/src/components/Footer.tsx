import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FiMail } from "@react-icons/all-files/fi/FiMail";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-dark text-light w-100 mt-5 mb-0">
            <Container className="p-5">
                <Row className="d-flex justify-content-center">
                    <Col
                        className="text-center mb-3"
                        style={{ minWidth: "10rem" }}
                    >
                        <h3 className="h5">Help</h3>
                        <div>
                            <Link to="/help" className="custom-link text-light">
                                Shipping
                            </Link>
                        </div>
                        <div>
                            <Link to="/help" className="custom-link text-light">
                                Terms & Privacy
                            </Link>
                        </div>
                        <div>
                            <Link to="/help" className="custom-link text-light">
                                Returns
                            </Link>
                        </div>
                    </Col>
                    <Col
                        className="text-center mb-3"
                        style={{ minWidth: "10rem" }}
                    >
                        <h3 className="h5">Contacts</h3>

                        <div className="d-flex justify-content-center gap-3">
                            <div>
                                <a
                                    href="https://github.com/Neirea"
                                    target="_blank"
                                    aria-label="GitHub"
                                >
                                    <FaGithub size={24} />
                                </a>
                            </div>
                            <div>
                                <a
                                    href="https://www.linkedin.com/in/eugene-shumilin/"
                                    target="_blank"
                                    aria-label="Linkedin"
                                >
                                    <FaLinkedin size={24} />
                                </a>
                            </div>
                            <div>
                                <a
                                    href="mailto:neirea@ukr.net"
                                    aria-label="Send Email"
                                >
                                    <FiMail size={24} />
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col className="text-center" style={{ minWidth: "10rem" }}>
                        <h3 className="h5">About Techway</h3>
                        <p className="text-secondary small">
                            "Techway" is a demo website to demonstrate a custom
                            ecommerce flow. Listed products are not real and we
                            do not collect any payment information. Do not use
                            your real personal or payment information.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
