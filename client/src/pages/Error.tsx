import { Container } from "react-bootstrap";

const Error = () => {
    return (
        <Container as="main" className="text-center mt-5">
            <b className="display-1">404</b>
            <h3>Page not found</h3>
            <br />
            <a href="/" className="btn btn-success text-decoration-none">
                Back Home
            </a>
        </Container>
    );
};

export default Error;
