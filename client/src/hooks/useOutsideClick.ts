import { type MutableRefObject, useEffect } from "react";

export const useOutsideClick = (
    refs: Array<MutableRefObject<HTMLElement | null>>,
    handleClose: () => void,
): void => {
    const controller = new AbortController();
    useEffect(() => {
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
