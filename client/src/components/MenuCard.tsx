import React from "react";
import { Card } from "react-bootstrap";
import { Product } from "../generated/graphql";

const MenuCard = () => {
	return (
		<Card style={{ maxWidth: "10rem" }}>
			<Card.Img
				variant="bottom"
				src="https://static.twitchcdn.net/assets/gaming-e9019587744b56b11b43.svg"
				style={{ width: "2rem" }}
			/>
			<Card.Body>
				<Card.Title>Phones</Card.Title>
				<Card.Link>Subcategory 1</Card.Link>
			</Card.Body>
		</Card>
	);
};

export default MenuCard;
