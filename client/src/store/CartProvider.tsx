import React, { type JSX, type ReactNode, useContext, useState } from "react";
import type { TCart } from "./useCartStore";

type TCartStore = {
    cart: TCart;
    changeCart: (value: TCart) => void;
};

export const CartContext = React.createContext({} as TCartStore);

export const CartProvider = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const [cart, setCart] = useState<TCart>([]);

    const changeCart = (value: TCart): void => {
        setCart(value);
    };

    return (
        <CartContext.Provider value={{ cart, changeCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): TCartStore => useContext(CartContext);

export default CartProvider;
