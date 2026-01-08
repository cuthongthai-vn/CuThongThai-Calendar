import React from 'react';

const RANGE_LABELS = [
    { key: 'this_week', label: '📅 Tuần này' },
    { key: 'today', label: '🔥 Hôm nay' },
    { key: 'tomorrow', label: '🔮 Ngày mai' },
    { key: 'next_week', label: '🔜 Tuần tới' },
    { key: 'yesterday', label: '⏪ Hôm qua' },
    { key: 'this_month', label: 'Tháng này' },
    { key: 'last_week', label: 'Tuần trước' },
    { key: 'next_month', label: 'Tháng tới' },
    { key: 'last_month', label: 'Tháng trước' },
];

const FilterSidebar = ({ selectedRange, onSelectRange }) => {
    return (
        <div className="w-full md:w-auto md:shrink-0">
            <div className="md:sticky md:top-8 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                <div className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-full">
                    {/* Header Removed as requested */}

                    {RANGE_LABELS.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => onSelectRange(item.key)}
                            className={`
                                text-sm font-semibold py-2 px-4 rounded-full md:rounded-lg text-left transition-all whitespace-nowrap
                                ${selectedRange === item.key
                                    ? 'bg-theme-yellow text-black shadow-lg shadow-yellow-500/20 scale-105'
                                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                                }
                            `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
