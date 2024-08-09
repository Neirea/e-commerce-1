import { useCallback } from "react";
import type { TProductWithImages } from "../types/Product";
import { useCart } from "./CartProvider";

export type TCartProductBase = {
    id: number;
};
export type TCartItem<TProduct extends TCartProductBase> = {
    product: TProduct;
    amount: number;
};
export type TCart = TCartItem<TProductWithImages>[];

export const getSyncedCart = (
    data: TProductWithImages[] | undefined,
    source: TCart
): { newState: TCart; errors: string[] } | undefined => {
    if (data?.length && source.length) {
        let errors: string[] = [];
        const newState: TCart = source.reduce<TCart>((result, item) => {
            const cartProduct = data.find((i) => item.product.id === i.id);
            if (!cartProduct) {
                errors.push(
                    `Product with id:${item.product.id} no longer exists.`
                );
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

export const addCartToLocalStorage = (products: TCart) => {
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
        (data: TProductWithImages[], source: TCart) => {
            const result = getSyncedCart(data, source);

            if (result?.newState) {
                addCartToLocalStorage(result.newState);
                changeCart(result.newState);
            }
            if (result?.errors.length) {
                return result.errors.join("\n");
            }
        },
        []
    );

    const addProductToCart = useCallback(
        (item: TCartItem<TProductWithImages>) => {
            const existingProduct = cart.find(
                (p) => p.product.id === item.product.id
            );

            let newCart: TCart = [];
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
        (product: TProductWithImages) => {
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
