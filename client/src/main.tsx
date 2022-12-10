import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import client from "./context/apolloClient";
import { AppProvider } from "./context/AppContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ApolloProvider client={client}>
                <AppProvider>
                    <App />
                </AppProvider>
            </ApolloProvider>
        </BrowserRouter>
    </React.StrictMode>
);
