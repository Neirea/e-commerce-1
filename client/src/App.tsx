import { lazy, Suspense } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import "./bootstrap.theme.css";
import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import RequireAuth from "./components/RequireAuth";
import ScrollAndHash from "./components/ScrollAndHash";
import { useAppContext } from "./context/AppContext";
import { Role } from "./generated/graphql";
import Checkout from "./pages/Checkout";
import Error from "./pages/Error";
import Help from "./pages/Help";
import Home from "./pages/Home/Home";
import OrderPayment from "./pages/OrderPayment";
import ProductWrapper from "./pages/Product/ProductWrapper";
import SearchPage from "./pages/SearchPage";
import Unauthorized from "./pages/Unauthorized";
const Orders = lazy(() => import("./pages/Orders"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Editor = lazy(() => import("./pages/Editor/Editor"));

const Loading = () => {
    return <Container as="main" className="main-loading" />;
};

function App() {
    const { user, isLoading } = useAppContext();

    return (
        <>
            <Header />
            {isLoading ? (
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
