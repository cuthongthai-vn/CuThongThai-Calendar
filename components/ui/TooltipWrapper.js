'use client';

import { Tooltip } from 'react-tooltip';
import { useEffect, useState } from 'react';

export default function TooltipWrapper({ id, content, children }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!content) return children;

    return (
        <>
            <span
                data-tooltip-id={id}
                data-tooltip-content={content}
                className="cursor-help border-b border-dotted border-gray-500 hover:text-theme-yellow transition-colors"
            >
                {children}
            </span>
            {isMounted && (
                <Tooltip
                    id={id}
                    place="top"
                    effect="solid"
                    className="z-50 max-w-xs text-sm bg-gray-900 border border-gray-700 shadow-xl rounded-lg p-3 !opacity-100"
                    style={{ backgroundColor: '#111827', color: '#f3f4f6' }}
                />
            )}
        </>
    );
}
