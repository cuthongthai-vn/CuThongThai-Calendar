'use client';

export default function Sparkline({ data, width = 60, height = 20, color = '#fbbf24' }) {
    // data is array of numbers or objects with 'actual' property
    if (!data || data.length < 2) return null;

    const values = data.map(d => typeof d === 'object' ? d.actual : d).filter(v => v !== null && v !== undefined);

    if (values.length < 2) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1; // Prevent division by zero

    const points = values.map((val, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((val - min) / range) * height; // Invert Y because SVG coordinates
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="inline-block ml-2 opacity-80" viewBox={`0 0 ${width} ${height}`}>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
