import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const Unauthorized = () => {
	const navigate = useNavigate();
	const goBack = () => navigate(-1);
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
