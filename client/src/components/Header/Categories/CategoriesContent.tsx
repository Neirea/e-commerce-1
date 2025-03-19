import { BiChevronRight } from "@react-icons/all-files/bi/BiChevronRight";
import { forwardRef, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import type { TCategory } from "../../../types/Category";

const createWrapperAndAppend = (): HTMLDivElement => {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "menu-portal");
    document.body.appendChild(modalRoot);
    return modalRoot;
};

const CategoriesContent = (
    {
        categories,
        handleClose,
    }: {
        categories: TCategory[];
        handleClose: () => void;
    },
    ref: React.Ref<HTMLDivElement>,
): JSX.Element | null => {
    const [lastHover, setLastHover] = useState<number | null>(null);
    const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();

    const subCategories = useMemo(() => {
        const subMap = new Map<number, TCategory[]>();
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
        return (): void => {
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
                                        className="d-flex align-items-center gap-2 text-decoration-none text-dark search-link ps-3 pe-3"
                                    >
                                        {category.name}
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
                                            className="text-decoration-none text-dark search-link ps-3 pe-3"
                                            to={`/search?c=${category.id}`}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
            </div>
        </section>,
        modalWrapper,
    );
};

export default forwardRef(CategoriesContent);
