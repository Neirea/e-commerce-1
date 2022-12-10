import { Col, Container, Row } from "react-bootstrap";
import useCurrentUser from "../../hooks/useCurrentUser";
import { Role } from "../../generated/graphql";
import Category from "./Category";
import Company from "./Company";
import Product from "./Product";

const Editor = () => {
    const { user } = useCurrentUser();
    return (
        <Container as="main">
            <Row>
                {user?.role.some((role) => [Role.ADMIN].includes(role)) && (
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
