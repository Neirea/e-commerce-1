import { useState, useRef, useEffect } from "react";

interface IOptions {
    root: HTMLElement | null;
    rootMargin: string;
    treshold: number;
}

const useInView = <T extends HTMLElement>(
    options: IOptions,
    cb: () => void
) => {
    const containerRef = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const makeElementVisible = (
            entries: Array<IntersectionObserverEntry>
        ) => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
        };
        const observer = new IntersectionObserver(makeElementVisible, options);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [options]);

    useEffect(() => {
        if (isVisible) {
            cb();
        }
    }, [isVisible]);

    return containerRef;
};

export default useInView;
