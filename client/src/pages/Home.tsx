import { Container, Row, Col, Card, Button } from "react-bootstrap";
import MenuCard from "../components/MenuCard";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

const Home = () => {
	// const {data,loading,error} = useQuery()
	return (
		<>
			<Container as="main">
				<Container className="d-flex flex-column justify-content-center align-items-center  mt-5 mb-5 gap-3">
					<Row className="w-100">
						<Col className="col-7 p-0">
							<img
								src="https://res.cloudinary.com/dna5i1spz/image/upload/v1663072786/ecommerce-1/static/logo_left_abz14a.jpg"
								alt="First img"
								width="100%"
								height="100%"
								className="mb-5"
							/>
						</Col>

						<Col className="bg-success col-5 p-5 d-flex flex-column justify-content-center">
							<h1 className="text-light fw-bold text-center fs-1">
								About Tech Shop
							</h1>
							<p className="text-light fs-4">
								Demo website to demonstrate a custom ecommerce flow. Listed
								products are not real and no payment information is collected.
							</p>
							<Link to="/search">
								<Button variant="light" className="w-100">
									Shop now
								</Button>
							</Link>
						</Col>
					</Row>

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
