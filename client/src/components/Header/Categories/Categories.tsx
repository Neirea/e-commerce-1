// import { useQuery } from "@apollo/client";
import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { getAllCategories } from "../../../queries/Category";
import CategoriesContent from "./CategoriesContent";
import { useQuery } from "@tanstack/react-query";

const Categories = () => {
    const { data } = useQuery({
        queryKey: ["category"],
        queryFn: getAllCategories,
    });
    // const { data } = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);
    const [showCategories, setShowCategories] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const categoriesRef = useRef<HTMLDivElement | null>(null);

    // Categories Menu
    const toggleCategories = () => setShowCategories((old) => !old);
    const handleCloseCategories = () => setShowCategories(false);

    useOutsideClick([menuButtonRef, categoriesRef], handleCloseCategories);

    return (
        <>
            <Button
                className="d-none d-sm-inline-block"
                variant="success"
                onClick={toggleCategories}
                ref={menuButtonRef}
            >
                Сatalog
            </Button>
            {!!showCategories && data && (
                <CategoriesContent
                    categories={data.data}
                    handleClose={handleCloseCategories}
                    ref={categoriesRef}
                />
            )}
        </>
    );
};

export default Categories;
