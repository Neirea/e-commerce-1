import { Container, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import MenuCard from "../components/MenuCard";

const Home = () => {
	return (
		<>
			<Container as="main">
				<Container className="d-flex justify-content-center mt-5 gap-3">
					<Row className="gap-3">
						<Col>
							<MenuCard />
						</Col>
						<Col>
							<MenuCard />
						</Col>
						<Col>
							<MenuCard />
						</Col>
						<Col>
							<MenuCard />
						</Col>
						<Col>
							<MenuCard />
						</Col>
						<Col>
							<MenuCard />
						</Col>
					</Row>
				</Container>

				<Container>
					<h1 className="text-center mt-5">Featured</h1>
					<Container className="d-flex justify-content-center mt-5 gap-3">
						<Row className="gap-3">
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
						</Row>
					</Container>
				</Container>
				<Container>
					<h1 className="text-center mt-5">Recommended</h1>
					<Container className="d-flex justify-content-center mt-5 gap-3">
						<Row className="gap-3">
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
						</Row>
					</Container>
				</Container>
			</Container>
			{/* <Container
				as="footer"
				className="bg-dark text-light"
				style={{ width: "100%" }}
			>
				Hello
			</Container> */}
			<footer className="bg-dark text-light w-100 mt-5 mb-0">
				<Container className="p-5">
					<Row className="d-flex justify-content-center">
						<Col>
							<h5>Title 4</h5>

							<div>Link 1</div>
							<div>Link 1</div>
							<div>Link 1</div>
						</Col>
						<Col>
							<h5>Title 4</h5>

							<div>Link 1</div>
							<div>Link 1</div>
							<div>Link 1</div>
						</Col>
						<Col>
							<h5>Title 4</h5>

							<div>Link 1</div>
							<div>Link 1</div>
							<div>Link 1</div>
							<div>Link 1</div>
							<div>Link 1</div>
						</Col>
						<Col>
							<h5>Title 4</h5>

							<div>Link 1</div>
							<div>Link 1</div>
							<div>Link 1</div>
						</Col>
					</Row>
				</Container>
			</footer>
		</>
	);
};

export default Home;
