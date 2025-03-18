import { useEffect, useRef, useState } from "react";

type TOptions = {
    root: HTMLElement | null;
    rootMargin: string;
    treshold: number;
};

const useInView = <T extends HTMLElement>(
    options: TOptions,
    cb: () => any,
    hasMore: boolean | undefined,
): React.MutableRefObject<T | null> => {
    const containerRef = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible && hasMore) {
            void cb();
        }
    }, [isVisible, hasMore]);

    useEffect(() => {
        const makeElementVisible = (
            entries: Array<IntersectionObserverEntry>,
        ): void => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
        };
        const observer = new IntersectionObserver(makeElementVisible, options);
        if (containerRef.current) observer.observe(containerRef.current);
        if (containerRef.current && !hasMore)
            observer.unobserve(containerRef.current);

        return (): void => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [options, hasMore]);

    return containerRef;
};

export default useInView;
