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
import Editor from "./pages/Editor/Editor";
import Error from "./pages/Error";
import Help from "./pages/Help";
import Home from "./pages/Home/Home";
import OrderPayment from "./pages/OrderPayment";
import Orders from "./pages/Orders";
import Product from "./pages/Product/Product";
import SearchPage from "./pages/SearchPage";
import Unauthorized from "./pages/Unauthorized";
import UserProfile from "./pages/UserProfile";

function App() {
    const { user, isLoading } = useAppContext();

    return (
        <>
            <Header />
            {isLoading ? (
                <Container as="main" className="main-loading" />
            ) : (
                <>
                    <ScrollAndHash />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/help" element={<Help />} />
                        {/* editor routes */}
                        <Route
                            element={
                                <RequireAuth
                                    allowedRoles={[Role.ADMIN, Role.EDITOR]}
                                />
                            }
                        >
                            <Route path="/editor" element={<Editor />} />
                        </Route>
                        <Route path="/product/:id" element={<Product />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route
                            path="/order_payment"
                            element={<OrderPayment />}
                        />

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
                                element={<UserProfile user={user} />}
                            />
                            <Route path="/orders" element={<Orders />} />
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
