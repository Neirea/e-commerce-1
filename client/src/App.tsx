import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import SearchPage from "./pages/SearchPage";
import Editor from "./pages/Editor/Editor";
import Unauthorized from "./pages/Unauthorized";
import Error from "./pages/Error";
import { useAppContext } from "./context/AppContext";
import { Container } from "react-bootstrap";
import RequireAuth from "./components/RequireAuth";
import { Role } from "./generated/graphql";
import UserProfile from "./pages/UserProfile";
import ScrollToTop from "./components/ScrollToTop";
import Product from "./pages/Product/Product";

function App() {
	const { user, isLoading } = useAppContext();

	return (
		<>
			<Header />
			{isLoading ? (
				<Container as="main" className="main-loading" />
			) : (
				<>
					<ScrollToTop />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/search" element={<SearchPage />} />
						{/* editor routes */}
						<Route
							element={<RequireAuth allowedRoles={[Role.Admin, Role.Editor]} />}
						>
							<Route path="/editor" element={<Editor />} />
						</Route>
						<Route path="/product/:id" element={<Product />} />
						{/* user routes */}
						<Route
							element={
								<RequireAuth
									allowedRoles={[Role.Admin, Role.Editor, Role.User]}
								/>
							}
						>
							<Route path="/profile" element={<UserProfile user={user} />} />
						</Route>

						<Route path="/unauthorized" element={<Unauthorized />} />
						<Route path="*" element={<Error />} />
					</Routes>
				</>
			)}

			<Footer />
		</>
	);
}

export default App;
