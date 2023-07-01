import { useCallback } from "react";
import { IProductWithImages } from "../types/Product";
import { getProductsById } from "../queries/Product";
import { useCart } from "./CartProvider";

export interface CartProductBase {
    id: number;
}
export interface CartItem<ProductType extends CartProductBase> {
    product: ProductType;
    amount: number;
}
export type CartType = CartItem<IProductWithImages>[];

export const getSyncedCart = (
    data: IProductWithImages[] | undefined,
    source: CartType
): { newState: CartType; errors: string[] } | undefined => {
    if (data?.length && source.length) {
        let errors: string[] = [];
        const newState: CartType = source.reduce<CartType>((result, item) => {
            const cartProduct = data.find((i) => item.product.id === i.id);
            if (!cartProduct) {
                errors.push(
                    `Product with id:${item.product.id} no longer exists.`
                );
                return result;
            }
            if (cartProduct.inventory <= 0) {
                errors.push(`${cartProduct.name} is out of stock.`);
                return result;
            }
            if (cartProduct.inventory < item.amount) {
                errors.push(
                    `Warning: You cart has changed due to available amount of ${cartProduct.name}.`
                );
            }
            const amount =
                cartProduct.inventory < item.amount
                    ? cartProduct.inventory
                    : item.amount;

            result.push({
                product: cartProduct,
                amount: amount,
            });
            return result;
        }, []);
        return { newState, errors };
    }
    return undefined;
};

export const addCartToLocalStorage = (products: CartType) => {
    localStorage.setItem(
        "cart",
        JSON.stringify(
            products.map((p) => {
                return {
                    product: { id: p.product.id },
                    amount: p.amount,
                };
            })
        )
    );
};

function useCartStore() {
    const { cart, changeCart } = useCart();

    const syncCart = useCallback(
        (data: IProductWithImages[], source: CartType) => {
            const result = getSyncedCart(data, source);
            if (result?.errors.length) {
                addCartToLocalStorage([]);
                return result.errors.join("\n");
            }
            if (result?.newState) {
                addCartToLocalStorage(result.newState);
                changeCart(result.newState);
            }
        },
        []
    );

    const addProductToCart = useCallback(
        (item: CartItem<IProductWithImages>) => {
            const existingProduct = cart.find(
                (p) => p.product.id === item.product.id
            );

            let newCart: CartType = [];
            if (existingProduct) {
                newCart = cart.map((i) => {
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

                addCartToLocalStorage(newCart);
                changeCart(newCart);
                return;
            }
            newCart = [...cart, item];
            addCartToLocalStorage(newCart);
            changeCart(newCart);
        },
        [cart]
    );

    const removeProductFromCart = useCallback(
        (product: IProductWithImages) => {
            const newCart = cart.filter((p) => p.product.id !== product.id);
            addCartToLocalStorage(newCart);
            changeCart(newCart);
        },
        [cart]
    );

    const clearCart = useCallback((clearVar?: boolean) => {
        addCartToLocalStorage([]);
        if (clearVar) {
            changeCart([]);
        }
    }, []);

    return {
        cart,
        changeCart,
        addProductToCart,
        removeProductFromCart,
        clearCart,
        syncCart,
    };
}

export default useCartStore;
