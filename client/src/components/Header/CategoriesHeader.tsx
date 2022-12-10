import { useQuery } from "@apollo/client";
import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { GetAllCategoriesQuery } from "../../generated/graphql";
import { QUERY_ALL_CATEGORIES } from "../../queries/Category";
import { useOutsideClick } from "../../utils/useOutsideClick";
import Categories from "../Categories";

const CategoriesHeader = () => {
    const { data } = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);
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
                variant="success"
                onClick={toggleCategories}
                ref={menuButtonRef}
            >
                Сatalog
            </Button>
            {!!showCategories && (
                <Categories
                    categories={data?.categories}
                    handleClose={handleCloseCategories}
                    ref={categoriesRef}
                />
            )}
        </>
    );
};

export default CategoriesHeader;
