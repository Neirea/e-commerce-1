import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
	return (
		<footer className="bg-dark text-light w-100 mt-5 mb-0">
			<Container className="p-5">
				<Row className="d-flex justify-content-center">
					<Col className="text-center mb-3" style={{ minWidth: "10rem" }}>
						<h3 className="h5">Help</h3>
						<div>Shipping</div>
						<div>Terms & Privacy</div>
						<div>Contact</div>
						<div>Returns</div>
					</Col>
					<Col className="text-center mb-3" style={{ minWidth: "10rem" }}>
						<h3 className="h5">Social media</h3>

						<div className="d-flex justify-content-center gap-3">
							<div>1</div>
							<div>2</div>
							<div>3</div>
						</div>
					</Col>
					<Col className="text-center" style={{ minWidth: "10rem" }}>
						<h3 className="h5">About Techway</h3>
						<p className="text-secondary small">
							"Techway" is a demo website to demonstrate a custom ecommerce
							flow. Listed products are not real and we do not collect any
							payment information. You are advised to not use your real personal
							or payment information.
						</p>
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
