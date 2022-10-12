import { useLayoutEffect, forwardRef, useState } from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";
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
		show,
	}: {
		categories: GetAllCategoriesQuery["categories"] | undefined;
		handleClose: () => void;
		show: boolean;
	},
	ref: React.Ref<HTMLDivElement>
) => {
	const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();
	// useOutsideClick(menuRef, handleClose);

	useLayoutEffect(() => {
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
			<div className="menu-wrapper pt-3" ref={ref}>
				<ul className="menu-list">
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
			</div>
		</section>,
		modalWrapper
	);
};

export default forwardRef(Categories);
