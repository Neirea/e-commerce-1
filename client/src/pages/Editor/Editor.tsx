import { Container, Row, Col } from "react-bootstrap";
import { useAppContext } from "../../context/AppContext";
import { Role } from "../../generated/graphql";
import Category from "./Category";
import Company from "./Company";
import Product from "./Product";

const Editor = () => {
	const { user } = useAppContext();
	return (
		<Container as="main">
			<Row>
				{user?.role.some((role) => [Role.Admin].includes(role)) && (
					<Col>
						<Category />
						<Company />
					</Col>
				)}
				<Col>
					<Product />
				</Col>
			</Row>
		</Container>
	);
};

export default Editor;
