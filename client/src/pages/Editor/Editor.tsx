import type { JSX } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import useCurrentUser from "../../hooks/useCurrentUser";
import Category from "./Category";
import Company from "./Company";
import Product from "./Product";

const Editor = (): JSX.Element => {
    const { user } = useCurrentUser();
    return (
        <Container as="main">
            <Row>
                {user?.role.some((role) => ["ADMIN"].includes(role)) && (
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
