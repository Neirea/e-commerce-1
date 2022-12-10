import { useQuery } from "@apollo/client";
import { lazy, Suspense } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import "./bootstrap.theme.css";
import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import RequireAuth from "./components/RequireAuth";
import ScrollAndHash from "./components/ScrollAndHash";
import { cartVar } from "./context/apolloClient";
import { useAppContext } from "./context/AppContext";
import {
    addCartToLocalStorage,
    CartType,
    getSyncedCart,
} from "./context/useApolloCartStore";
import { GetProductsByIdQuery, Role } from "./generated/graphql";
import Checkout from "./pages/Checkout";
import Error from "./pages/Error";
import Help from "./pages/Help";
import Home from "./pages/Home/Home";
import OrderPayment from "./pages/OrderPayment";
import ProductWrapper from "./pages/Product/ProductWrapper";
import SearchPage from "./pages/SearchPage";
import Unauthorized from "./pages/Unauthorized";
import { QUERY_PRODUCTS_BY_ID } from "./queries/Product";
const Orders = lazy(() => import("./pages/Orders"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Editor = lazy(() => import("./pages/Editor/Editor"));

const Loading = () => {
    return <Container as="main" className="main-loading" />;
};

function App() {
    const { user, isLoading } = useAppContext();
    const localCart: CartType = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    const { loading: syncQueryLoading } = useQuery<GetProductsByIdQuery>(
        QUERY_PRODUCTS_BY_ID,
        {
            variables: { ids: localCart.map((i) => i.product.id) },
            onCompleted(data) {
                const result = getSyncedCart(data, localCart);
                if (result?.newState) {
                    addCartToLocalStorage(result.newState);
                    cartVar(result.newState);
                }
            },
        }
    );

    const loading = isLoading || syncQueryLoading;

    return (
        <>
            <Header />
            {loading ? (
                <Loading />
            ) : (
                <>
                    <ScrollAndHash />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/help" element={<Help />} />

                        <Route
                            path="/product/:id"
                            element={<ProductWrapper />}
                        />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route
                            path="/order_payment"
                            element={<OrderPayment />}
                        />
                        {/* editor routes */}
                        <Route
                            element={
                                <RequireAuth
                                    allowedRoles={[Role.ADMIN, Role.EDITOR]}
                                />
                            }
                        >
                            <Route
                                path="/editor"
                                element={
                                    <Suspense fallback={<Loading />}>
                                        <Editor />
                                    </Suspense>
                                }
                            />
                        </Route>
                        {/* user routes */}
                        <Route
                            element={
                                <RequireAuth
                                    allowedRoles={[
                                        Role.ADMIN,
                                        Role.EDITOR,
                                        Role.USER,
                                    ]}
                                />
                            }
                        >
                            <Route
                                path="/profile"
                                element={
                                    <Suspense fallback={<Loading />}>
                                        <UserProfile user={user} />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <Suspense fallback={<Loading />}>
                                        <Orders />
                                    </Suspense>
                                }
                            />
                        </Route>
                        {/* error routes */}
                        <Route
                            path="/unauthorized"
                            element={<Unauthorized />}
                        />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </>
            )}

            <Footer />
        </>
    );
}

export default App;
