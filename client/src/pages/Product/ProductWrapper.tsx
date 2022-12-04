import { useParams } from "react-router-dom";
import Product from "./Product";

//resets forms
const ProductWrapper = () => {
    const { id } = useParams();
    return <Product key={id} />;
};

export default ProductWrapper;
