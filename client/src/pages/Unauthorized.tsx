import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router";

const Unauthorized = (): JSX.Element => {
    const navigate = useNavigate();
    const goBack = (): void => void navigate(-1);
    return (
        <Container as="main" className="text-center mt-5">
            <h1>Unauthorized</h1>
            <h5>You do not have access to the requested page.</h5>
            <br />
            <Button className="btn btn-success" onClick={goBack}>
                Go Back
            </Button>
        </Container>
    );
};

export default Unauthorized;
