import { BiChevronRight } from "@react-icons/all-files/bi/BiChevronRight";
import { forwardRef, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { GetAllCategoriesQuery } from "../../generated/graphql";

const createWrapperAndAppend = () => {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "menu-portal");
    document.body.appendChild(modalRoot);
    return modalRoot;
};

const Categories = (
    {
        categories,
        handleClose,
    }: {
        categories: GetAllCategoriesQuery["categories"] | undefined;
        handleClose: () => void;
    },
    ref: React.Ref<HTMLDivElement>
) => {
    const [lastHover, setLastHover] = useState<number | null>(null);
    const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();

    const subCategories = useMemo(() => {
        const subMap = new Map<
            number,
            Array<GetAllCategoriesQuery["categories"][0]>
        >();
        if (categories?.length) {
            categories.forEach((item) => {
                if (item.parent_id != null) {
                    const currentSub = subMap.get(item.parent_id);
                    const newInfo =
                        currentSub !== undefined
                            ? [...currentSub, item]
                            : [item];
                    subMap.set(item.parent_id, [...new Set(newInfo)]);
                }
            });

            return subMap;
        }
        return null;
    }, [categories]);

    useEffect(() => {
        let modalRoot = document.getElementById("menu-portal");
        if (!modalRoot) {
            modalRoot = createWrapperAndAppend();
        }
        setModalWrapper(modalRoot);
        return () => {
            modalRoot?.parentNode?.removeChild(modalRoot);
        };
    }, []);

    if (!modalWrapper) return null;

    return ReactDOM.createPortal(
        <section className="menu-portal">
            <div className="menu-wrapper" ref={ref}>
                <ul className="menu-list">
                    {categories?.map((category) => {
                        if (category.parent_id == undefined) {
                            return (
                                <li
                                    key={category.id}
                                    onClick={handleClose}
                                    onMouseEnter={() =>
                                        setLastHover(category.id)
                                    }
                                >
                                    <Link
                                        to={`/search?c=${category.id}`}
                                        className="d-flex align-items-center gap-2 text-decoration-none search-link ps-3 pe-3"
                                    >
                                        <span className="custom-link">
                                            {category.name}
                                        </span>

                                        {!!subCategories?.get(category.id)
                                            ?.length && (
                                            <BiChevronRight size={20} />
                                        )}
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
                {lastHover !== null &&
                    !!subCategories?.get(lastHover)?.length && (
                        <ul className="submenu-list">
                            {subCategories?.get(lastHover)?.map((category) => {
                                return (
                                    <li key={category.id} onClick={handleClose}>
                                        <Link
                                            className="text-decoration-none search-link ps-3 pe-3"
                                            to={`/search?c=${category.id}`}
                                        >
                                            <span className="custom-link">
                                                {category.name}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
            </div>
        </section>,
        modalWrapper
    );
};

export default forwardRef(Categories);
