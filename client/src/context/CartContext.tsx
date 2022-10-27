import { useQuery } from "@apollo/client";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { GetProductsByIdQuery } from "../generated/graphql";
import { QUERY_PRODUCTS_BY_ID } from "../queries/Product";

export interface CartProductBase {
	id: number;
}
export type ProductDBType = GetProductsByIdQuery["productsById"][number];

export interface CartItem<ProductType extends CartProductBase> {
	product: ProductType;
	amount: number;
}
export interface CartContext<ProductType extends CartProductBase> {
	cart: Array<CartItem<ProductType>>;
	addProductToCart: (item: CartItem<ProductType>) => void;
	removeProductFromCart: (item: ProductType) => void;
	clearCart: () => void;
}

const defaultContext: CartContext<ProductDBType> = {
	cart: [],
	addProductToCart: () => {},
	removeProductFromCart: () => {},
	clearCart: () => {},
};
export const CartContext = createContext(defaultContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [products, setProducts] = useState<Array<CartItem<ProductDBType>>>([]);
	const localCart: Array<CartItem<CartProductBase>> = JSON.parse(
		localStorage.getItem("cart") || "[]"
	);
	useQuery<GetProductsByIdQuery>(QUERY_PRODUCTS_BY_ID, {
		variables: { ids: localCart.map((i) => i.product.id) },
		// skip: !localCart.length,
		onCompleted(data) {
			if (data.productsById.length) {
				const newState: Array<CartItem<ProductDBType>> = localCart.map(
					(item) => {
						const cartProduct = data.productsById.find(
							(i) => item.product.id === i.id
						)!;
						return {
							product: cartProduct,
							amount: item.amount,
						};
					}
				);
				setProducts(newState);
			}
		},
	});

	//transfer cart state to local storage
	useEffect(() => {
		if (!products) return;
		localStorage.setItem(
			"cart",
			JSON.stringify(
				products.map((p) => {
					return { product: { id: p.product.id }, amount: p.amount };
				})
			)
		);
	}, [products]);

	const addProductToCart = (item: CartItem<ProductDBType>) => {
		//check for existing product
		const existingProduct = products.find(
			(p) => p.product.id === item.product.id
		);

		let newState: Array<CartItem<ProductDBType>> = [];
		if (existingProduct) {
			newState = products.map((i) => {
				if (i.product.id === existingProduct.product.id) {
					return {
						product: i.product,
						amount: i.amount + item.amount,
					};
				}
				return i;
			});

			setProducts(newState);
			return;
		}
		setProducts((old) => [...old, item]);
	};

	const removeProductFromCart = (product: ProductDBType) => {
		const newProducts = products.filter((p) => p.product.id !== product.id);

		setProducts(newProducts);
	};

	const clearCart = () => {
		setProducts([]);
	};

	const contextValue: CartContext<ProductDBType> = {
		cart: products,
		addProductToCart: addProductToCart,
		removeProductFromCart: removeProductFromCart,
		clearCart: clearCart,
	};

	return (
		<CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
	);
};

export const useCartContext = () => {
	return useContext(CartContext);
};
