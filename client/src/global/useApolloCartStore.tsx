import { useLazyQuery, useReactiveVar } from "@apollo/client";
import { useCallback } from "react";
import { GetProductsByIdQuery } from "../generated/graphql";
import { QUERY_PRODUCTS_BY_ID } from "../queries/Product";
import { cartVar } from "./apolloClient";

export interface CartProductBase {
    id: number;
}
export interface CartItem<ProductType extends CartProductBase> {
    product: ProductType;
    amount: number;
}
export type ProductDBType = GetProductsByIdQuery["productsById"][number];
export type CartType = Array<CartItem<ProductDBType>>;

export const getSyncedCart = (
    data: GetProductsByIdQuery | undefined,
    source: CartType
): { newState: CartType; errors: string[] } | undefined => {
    if (data?.productsById.length && source.length) {
        let errors: string[] = [];
        const newState: CartType = source.reduce<CartType>((result, item) => {
            const cartProduct = data.productsById.find(
                (i) => item.product.id === i.id
            );
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

function useApolloCartStore() {
    const cart = useReactiveVar(cartVar);
    const [getSyncProducts] = useLazyQuery<GetProductsByIdQuery>(
        QUERY_PRODUCTS_BY_ID,
        {
            fetchPolicy: "network-only",
        }
    );

    const syncCart = useCallback(async (source: CartType) => {
        const { data } = await getSyncProducts({
            variables: { ids: source.map((i) => i.product.id) },
        });
        const result = getSyncedCart(data, source);
        if (result?.newState) {
            addCartToLocalStorage(result.newState);
            cartVar(result.newState);
        }
        if (result?.errors.length) {
            return result.errors.join("\n");
        }
    }, []);

    const addProductToCart = useCallback(
        (item: CartItem<ProductDBType>) => {
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
                cartVar(newCart);
                return;
            }
            newCart = [...cart, item];
            addCartToLocalStorage(newCart);
            cartVar(newCart);
        },
        [cart]
    );

    const removeProductFromCart = useCallback(
        (product: ProductDBType) => {
            const newCart = cart.filter((p) => p.product.id !== product.id);
            addCartToLocalStorage(newCart);
            cartVar(newCart);
        },
        [cart]
    );

    const clearCart = useCallback((clearVar?: boolean) => {
        addCartToLocalStorage([]);
        if (clearVar) {
            cartVar([]);
        }
    }, []);

    return {
        cart,
        addProductToCart,
        removeProductFromCart,
        clearCart,
        syncCart,
    };
}

export default useApolloCartStore;
