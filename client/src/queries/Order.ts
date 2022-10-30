import { gql } from "@apollo/client";

export const QUERY_ALL_ORDERS = gql`
	query GetAllOrders {
		orders {
			id
			status
			user_id
			buyer_name
			buyer_email
			buyer_phone
			delivery_address
			shipping_cost
			order_items {
				amount
				price
				product {
					name
				}
			}
		}
	}
`;