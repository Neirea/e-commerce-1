import { type RefObject, useEffect } from "react";

export const useOutsideClick = (
    refs: Array<RefObject<HTMLElement | null>>,
    handleClose: () => void,
): void => {
    useEffect(() => {
        const controller = new AbortController();
        document.addEventListener(
            "click",
            (e) => {
                if (
                    refs.every(
                        (ref) =>
                            ref.current != null &&
                            !ref.current.contains(e.target as Node),
                    )
                ) {
                    handleClose();
                }
            },
            { signal: controller.signal },
        );
        return (): void => {
            controller.abort();
        };
    }, []);
};
