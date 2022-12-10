import { ApolloClient, DefaultOptions, InMemoryCache } from "@apollo/client";
import create from "zustand";
import { GetProductsByIdQuery } from "../generated/graphql";
import { QUERY_PRODUCTS_BY_ID } from "../queries/Product";
import { serverUrl } from "../utils/server";

export interface CartProductBase {
    id: number;
}
export interface CartItem<ProductType extends CartProductBase> {
    product: ProductType;
    amount: number;
}
export type ProductDBType = GetProductsByIdQuery["productsById"][number];
export type CartType = Array<CartItem<ProductDBType>>;

interface CartState {
    cart: CartType;
    addCartToLocalStorage: (products: CartType) => void;
    syncCart: (source: CartType) => Promise<string | undefined>;
    addProductToCart: (item: CartItem<ProductDBType>) => void;
    removeProductFromCart: (product: ProductDBType) => void;
    clearCart: () => void;
}

//no cache client for sync'ing cart data
const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
    },
    query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    },
};
const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: `${serverUrl}/graphql`,
    credentials: "include",
    defaultOptions: defaultOptions,
});
const GetProductsById = async (ids: number[]) => {
    const { data } = await client.query<GetProductsByIdQuery>({
        query: QUERY_PRODUCTS_BY_ID,
        variables: { ids: ids },
    });
    return data;
};

const getSyncedCart = async (
    source: CartType
): Promise<{ newState: CartType; errors: string[] } | undefined> => {
    const data = await GetProductsById(source.map((i) => i.product.id));
    if (data.productsById.length && source.length) {
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
            if (cartProduct.inventory === 0) {
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

const useCartStore = create<CartState>((set) => {
    return {
        cart: [],
        addCartToLocalStorage(products) {
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
        },
        //syncs with DB
        async syncCart(source) {
            const result = await getSyncedCart(source);
            if (result?.newState) {
                set((state) => {
                    state.addCartToLocalStorage(result.newState);
                    return { cart: result.newState };
                });
            }
            if (result?.errors.length) {
                return result.errors.join("\n");
            }
        },
        addProductToCart(item) {
            set((state) => {
                const existingProduct = state.cart.find(
                    (p) => p.product.id === item.product.id
                );

                let newCart: CartType = [];
                if (existingProduct) {
                    newCart = state.cart.map((i) => {
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

                    state.addCartToLocalStorage(newCart);
                    return { cart: newCart };
                }
                newCart = [...state.cart, item];
                state.addCartToLocalStorage(newCart);
                return { cart: newCart };
            });
        },
        removeProductFromCart(product) {
            set((state) => {
                const newCart = state.cart.filter(
                    (p) => p.product.id !== product.id
                );
                state.addCartToLocalStorage(newCart);
                return { cart: newCart };
            });
        },
        clearCart() {
            set((state) => {
                state.addCartToLocalStorage([]);
                return { cart: [] };
            });
        },
    };
});

export default useCartStore;
