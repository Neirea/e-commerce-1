import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import "./bootstrap.theme.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoadingProgress from "./components/LoadingProgress";
import RequireAuth from "./components/RequireAuth";
import ScrollAndHash from "./components/ScrollAndHash";
import useCurrentUser from "./hooks/useCurrentUser";
import Error from "./pages/Error";
import Help from "./pages/Help";
import Home from "./pages/Home";
import OrderPayment from "./pages/OrderPayment";
import ProductWrapper from "./pages/Product";
import SearchPage from "./pages/SearchPage";
import Unauthorized from "./pages/Unauthorized";
import { getProductsById } from "./queries/Product";
import useCartStore, { CartType } from "./store/useCartStore";
const Orders = lazy(() => import("./pages/Orders"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Editor = lazy(() => import("./pages/Editor/Editor"));
const Checkout = lazy(() => import("./pages/Checkout"));

const Loading = () => {
    return <Container as="main" className="main-loading" />;
};

function App() {
    const { syncCart } = useCartStore();
    const { user, isLoading } = useCurrentUser();

    let localCart: CartType = [];
    let ids: number[] = [];
    try {
        localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        ids = localCart.map((i) => i.product.id);
    } catch (error) {
        console.error(error);
        localStorage.setItem("cart", "[]");
    }
    const { isLoading: syncQueryLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getProductsById(ids),
        onSuccess: (data) => {
            syncCart(data.data, localCart);
        },
    });

    const loading = isLoading || syncQueryLoading;

    if (isLoading)
        return (
            <>
                <Header />
                <LoadingProgress isLoading={loading} />
            </>
        );

    return (
        <>
            <Header />
            <LoadingProgress isLoading={loading} />
            <>
                <ScrollAndHash />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/help" element={<Help />} />

                    <Route path="/product/:id" element={<ProductWrapper />} />
                    <Route
                        path="/checkout"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Checkout />
                            </Suspense>
                        }
                    />
                    <Route path="/order_payment" element={<OrderPayment />} />
                    {/* editor routes */}
                    <Route
                        element={
                            <RequireAuth allowedRoles={["ADMIN", "EDITOR"]} />
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
                                allowedRoles={["ADMIN", "EDITOR", "USER"]}
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
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </>
            <Footer />
        </>
    );
}

export default App;
