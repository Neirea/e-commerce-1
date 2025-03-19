import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import CartProvider from "./store/CartProvider";

axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}/api`;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 300_000,
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <CartProvider>
                    <App />
                </CartProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
