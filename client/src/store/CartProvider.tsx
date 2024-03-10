import React, { ReactNode, useContext, useState } from "react";
import { CartType } from "./useCartStore";

type CartStore = {
    cart: CartType;
    changeCart: (value: CartType) => void;
};

export const CartContext = React.createContext<CartStore>({} as CartStore);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartType>([]);

    const changeCart = (value: CartType) => {
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
