import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import GQLTEST from "./GQLTest";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import SearchPage from "./pages/SearchPage";
import Editor from "./pages/Editor/Editor";
import Unauthorized from "./pages/Unauthorized";
import Error from "./pages/Error";
import { useAppContext } from "./context/AppContext";
import { Container } from "react-bootstrap";

function App() {
	const { isLoading } = useAppContext();

	return (
		<>
			{/* <GQLTEST></GQLTEST> */}
			<Header />
			{isLoading ? (
				<Container as="main" className="mt-5 text-center">
					Loading...
				</Container>
			) : (
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/editor" element={<Editor />} />
					<Route path="/unauthorized" element={<Unauthorized />} />
					<Route path="*" element={<Error />} />
				</Routes>
			)}

			<Footer />
		</>
	);
}

export default App;
