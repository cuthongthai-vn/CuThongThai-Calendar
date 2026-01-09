'use client';

import { useState, useEffect, useRef } from 'react';

export default function LazyLoad({ children, height = '300px', offset = '200px' }) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: offset, // Load content before it enters viewport
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) observer.disconnect();
        };
    }, [offset]);

    return (
        <div ref={containerRef} style={{ minHeight: height }} className="transition-opacity duration-500 ease-in-out">
            {isVisible ? children : <div className="w-full h-full bg-slate-900/20 animate-pulse rounded-xl" />}
        </div>
    );
}
