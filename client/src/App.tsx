import { Routes, Route } from "react-router-dom";
import GQLTEST from "./GQLTest";
import Home from "./pages/Home";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	return (
		<>
			{/* <GQLTEST></GQLTEST> */}
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</>
	);
}

export default App;
