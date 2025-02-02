import { type MutableRefObject, useEffect } from "react";

export const useOutsideClick = (
    refs: Array<MutableRefObject<any>>,
    handleClose: () => void
) => {
    const controller = new AbortController();
    useEffect(() => {
        document.addEventListener(
            "click",
            (e) => {
                if (
                    refs.every(
                        (ref) =>
                            ref.current != null &&
                            !ref.current.contains(e.target)
                    )
                ) {
                    handleClose();
                }
            },
            { signal: controller.signal }
        );
        return () => {
            controller.abort();
        };
    }, []);
};
