import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import GQLTEST from "./GQLTest";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import SearchPage from "./pages/SearchPage";
import Unauthorized from "./pages/Unauthorized";
import Error from "./pages/Error";

function App() {
	return (
		<>
			{/* <GQLTEST></GQLTEST> */}
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/search" element={<SearchPage />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route path="*" element={<Error />} />
			</Routes>
			<Footer />
		</>
	);
}

export default App;
