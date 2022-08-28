import { Container, Row, Col, Form, Image, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { BiCart } from "@react-icons/all-files/bi/BiCart";

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchValue = searchParams.get("value");
	const searchCategory = searchParams.get("category");
	return (
		<Container as="main">
			<h4 className="mb-3 mt-3">{`Results for «${searchValue}»`}</h4>
			<div className="d-flex justify-content-end align-items-center gap-3">
				<span>Sort by</span>
				<Form.Select className="w-auto" aria-label="Sort by">
					<option>Most popular</option>
					<option>Price, low to high</option>
					<option>Price, high to low</option>
				</Form.Select>
			</div>
			<Row className="border-top mt-2">
				<Col sm="2" className="border-bottom border-end">
					{/* Below or Filter for details */}
					<div className="mt-3">Category 1</div>
					<div className="ps-2">SubCategory(2)</div>
					<div className="ps-2">SubCategory(6)</div>
					<div>Category 2(5)</div>
					<div>Category 3</div>
					<div className="ps-2">SubCategory(6)</div>
				</Col>

				<Col sm="10">
					{/* <div className="vr" /> */}
					<Row>
						<Col sm="3" className="border-bottom border-end">
							<Image
								fluid={true}
								src="https://content1.rozetka.com.ua/goods/images/big_tile/37361699.jpg"
								alt="Product name"
							/>
							<div>Product name</div>
							<div>Rating</div>
							<Row className="d-flex align-items-center">
								{/* Crossed out price if discount */}
								<Col as="h5" sm="8">
									Price $
								</Col>
								<Col sm="4">
									<Button variant="link" className="link-success">
										{/* Filled in icon(or dif color) if it's in cart */}
										<BiCart size={"2rem"} />
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default SearchPage;
