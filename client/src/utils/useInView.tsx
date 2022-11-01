import { useState, useRef, useEffect } from "react";

interface IOptions {
    root: HTMLElement | null;
    rootMargin: string;
    treshold: number;
}

const useInView = <T extends HTMLElement>(options: IOptions) => {
    const containerRef = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const makeElementVisible = (entries: Array<IntersectionObserverEntry>) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(makeElementVisible, options);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [containerRef, options]);

    return { containerRef, isVisible };
};

export default useInView;
