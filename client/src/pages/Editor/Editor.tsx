import React, { ChangeEvent, FormEvent, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Category from "./Category";
import Company from "./Company";
import Product from "./Product";

const Editor = () => {
	return (
		<Container as="main">
			<Row>
				<Col>
					<Category />
					<Company />
				</Col>
				<Col>
					<Product />
				</Col>
			</Row>
		</Container>
	);
};

export default Editor;
