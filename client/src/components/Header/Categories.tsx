import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { GetAllCategoriesQuery } from "../../generated/graphql";

const Categories = ({
	categories,
	handleClose,
	show,
}: {
	categories: GetAllCategoriesQuery["categories"] | undefined;
	handleClose: () => void;
	show: boolean;
}) => {
	const menuContainerRef = useRef<HTMLElement | null>(null);
	const menuRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		if (menuContainerRef.current == null) return;
		//get current height of list
		if (show && menuRef.current != null) {
			const menuRefHeight = menuRef.current.getBoundingClientRect().width;
			menuContainerRef.current.style.width = `${menuRefHeight}px`;
			return;
		}
		menuContainerRef.current.style.width = "0px";
	}, [show]);

	return (
		<section className="menu-wrapper" ref={menuContainerRef}>
			<ul className="menu-list" ref={menuRef}>
				{categories?.map((category) => {
					if (category.parent_id == undefined) {
						return (
							<li
								key={uuidv4()}
								className="menu-item"
								// to={`/search?c=${category.id}`}
								onClick={handleClose}
							>
								{category.name}
							</li>
						);
					}
				})}
			</ul>
		</section>
	);
};

export default Categories;
