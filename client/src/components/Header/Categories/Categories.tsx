import { useRef, useState, type JSX } from "react";
import Button from "react-bootstrap/Button";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { getAllCategories } from "../../../queries/Category";
import CategoriesContent from "./CategoriesContent";
import { useQuery } from "@tanstack/react-query";

const Categories = (): JSX.Element => {
    const { data } = useQuery({
        queryKey: ["category"],
        queryFn: getAllCategories,
    });
    const [showCategories, setShowCategories] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const categoriesRef = useRef<HTMLDivElement | null>(null);

    const toggleCategories = (): void => setShowCategories((old) => !old);
    const handleCloseCategories = (): void => setShowCategories(false);

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
