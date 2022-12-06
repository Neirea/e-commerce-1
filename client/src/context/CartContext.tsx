import { useQuery } from "@apollo/client";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
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
    const [products, setProducts] = useState<Array<CartItem<ProductDBType>>>(
        []
    );
    const localCart: Array<CartItem<CartProductBase>> = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );
    //load data on change of products in cart
    useQuery<GetProductsByIdQuery>(QUERY_PRODUCTS_BY_ID, {
        variables: { ids: localCart.map((i) => i.product.id) },
        skip: !localCart.length,
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

    //function to add/change cart in local storage
    const addCartToLocalStorage = useCallback(
        (addProducts: typeof products) => {
            localStorage.setItem(
                "cart",
                JSON.stringify(
                    addProducts.map((p) => {
                        return {
                            product: { id: p.product.id },
                            amount: p.amount,
                        };
                    })
                )
            );
        },
        []
    );

    const addProductToCart = useCallback(
        (item: CartItem<ProductDBType>) => {
            //check for existing product
            const existingProduct = products.find(
                (p) => p.product.id === item.product.id
            );

            let newState: Array<CartItem<ProductDBType>> = [];
            if (existingProduct) {
                newState = products.map((i) => {
                    if (i.product.id === existingProduct.product.id) {
                        const amount =
                            i.amount + item.amount > item.product.inventory
                                ? item.product.inventory
                                : i.amount + item.amount;
                        return {
                            product: i.product,
                            amount: amount,
                        };
                    }
                    return i;
                });

                setProducts(newState);
                addCartToLocalStorage(newState);
                return;
            }
            setProducts((old) => {
                const newState = [...old, item];
                addCartToLocalStorage(newState);
                return newState;
            });
        },
        [products]
    );

    const removeProductFromCart = useCallback(
        (product: ProductDBType) => {
            const newProducts = products.filter(
                (p) => p.product.id !== product.id
            );
            setProducts(newProducts);
            addCartToLocalStorage(newProducts);
        },
        [products]
    );

    const clearCart = useCallback(() => {
        setProducts([]);
        addCartToLocalStorage([]);
    }, []);

    const contextValue: CartContext<ProductDBType> = {
        cart: products,
        addProductToCart: addProductToCart,
        removeProductFromCart: removeProductFromCart,
        clearCart: clearCart,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    return useContext(CartContext);
};
