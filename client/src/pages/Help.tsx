import { Container } from "react-bootstrap";

const Help = () => {
    return (
        <Container as="main">
            <Container className="mb-5 mt-5">
                <h2 className="text-center pb-2">Shipping</h2>
                <p className="fs-5">
                    This is a demo site. Products listed here are only for
                    demonstration purposes. Orders will not proceed past
                    checkout page.
                </p>
            </Container>
            <Container className="mb-5">
                <h2 className="text-center pb-2">Terms & Privacy</h2>
                <p className="fs-5">
                    We do not collect any personal data. No payments will
                    proceed.
                </p>
            </Container>
            <Container>
                <h2 className="text-center pb-2">Returns</h2>
                <p className="fs-5">
                    <a href="mailto:neirea@ukr.net" className="link-primary">
                        Contact us
                    </a>
                    {" via email to request a return"}
                </p>
            </Container>
        </Container>
    );
};

export default Help;
