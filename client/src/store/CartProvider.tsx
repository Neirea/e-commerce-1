import React, { type ReactNode, useContext, useState } from "react";
import type { TCart } from "./useCartStore";

type TCartStore = {
    cart: TCart;
    changeCart: (value: TCart) => void;
};

export const CartContext = React.createContext({} as TCartStore);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<TCart>([]);

    const changeCart = (value: TCart) => {
        setCart(value);
    };

    return (
        <CartContext.Provider value={{ cart, changeCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;
