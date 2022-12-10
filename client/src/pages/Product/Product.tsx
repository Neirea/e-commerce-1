import { useParams } from "react-router-dom";
import ProductContent from "./ProductContent";

//resets forms
const Product = () => {
    const { id } = useParams();
    return <ProductContent key={id} />;
};

export default Product;
