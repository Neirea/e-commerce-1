import { createContext, ReactNode, useContext, useState } from "react";

export interface CartProductBase {
	id: number;
}

export interface ICartItem<ProductType extends CartProductBase> {
	product: ProductType;
	amount: number;
}
export interface ICartContext<ProductType extends CartProductBase> {
	cart: Array<ICartItem<ProductType>>;
	addProductToCart: (item: ICartItem<ProductType>) => void;
	removeProductFromCart: (item: ProductType) => void;
}

const defaultContext: ICartContext<any> = {
	cart: [],
	addProductToCart: () => {},
	removeProductFromCart: () => {},
};

export const CartContext = createContext(defaultContext);

export const cartProvider = <ProductType extends CartProductBase>({
	children,
}: {
	children: ReactNode;
}) => {
	const [products, setProducts] = useState<Array<ICartItem<ProductType>>>([]);

	const getProductById = (id: number) => {
		return products.find((p) => p.product.id === id);
	};

	const addProductToCart = (item: ICartItem<ProductType>) => {
		//check for existing product
		const existingProduct = getProductById(item.product.id);
		let newState: Array<ICartItem<ProductType>> = [];
		if (existingProduct) {
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
			}
			setProducts([...products, item]);
		}
	};

	const removeProductFromCart = (product: ProductType) => {
		const newProducts = products.filter((p) => p.product.id !== product.id);

		setProducts(newProducts);
	};

	const contextValue: ICartContext<ProductType> = {
		cart: products,
		addProductToCart: addProductToCart,
		removeProductFromCart: removeProductFromCart,
	};

	return (
		<CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
	);
};

export const useCartContext = () => {
	return useContext(CartContext);
};
