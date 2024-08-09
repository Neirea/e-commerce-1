import { useEffect, useRef, useState } from "react";

type TOptions = {
    root: HTMLElement | null;
    rootMargin: string;
    treshold: number;
};

const useInView = <T extends HTMLElement>(
    options: TOptions,
    cb: () => void,
    hasMore: boolean | undefined
) => {
    const containerRef = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible && hasMore) {
            cb();
        }
    }, [isVisible, hasMore]);

    useEffect(() => {
        const makeElementVisible = (
            entries: Array<IntersectionObserverEntry>
        ) => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
        };
        const observer = new IntersectionObserver(makeElementVisible, options);
        if (containerRef.current) observer.observe(containerRef.current);
        if (containerRef.current && !hasMore)
            observer.unobserve(containerRef.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [options, hasMore]);

    return containerRef;
};

export default useInView;
