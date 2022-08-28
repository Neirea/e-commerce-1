import { Routes, Route } from "react-router-dom";
import GQLTEST from "./GQLTest";
import Home from "./pages/Home";
import Login from "./components/Login";
import Header from "./components/Header/Header";
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
