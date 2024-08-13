import { type MutableRefObject, useEffect } from "react";

export const useOutsideClick = (
    refs: Array<MutableRefObject<any>>,
    handleClose: () => void
) => {
    const handleClickOutside = (e: MouseEvent) => {
        if (
            refs.every(
                (ref) => ref.current != null && !ref.current.contains(e.target)
            )
        ) {
            handleClose();
        }
    };
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
};
