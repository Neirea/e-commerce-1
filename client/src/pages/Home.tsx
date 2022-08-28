import { Container, Row, Col } from "react-bootstrap";
import MenuCard from "../components/MenuCard";

const Home = () => {
	return (
		<>
			<Container as="main">
				<Container className="d-flex flex-column justify-content-center align-items-center  mt-5 mb-5 gap-3">
					<img
						src="https://www.robin-noorda.com/uploads/1/6/8/3/16830688/3347022_orig.jpg"
						alt="First img"
						width="700px"
						height="300px"
						className="mb-5"
					/>
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
					<h2 className="text-center mt-5">Featured</h2>
					<Container className="d-flex justify-content-center mt-3 gap-3">
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
					<h2 className="text-center mt-5">Recommended</h2>
					<Container className="d-flex justify-content-center mt-3 gap-3">
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
		</>
	);
};

export default Home;
