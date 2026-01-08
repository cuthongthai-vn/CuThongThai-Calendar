'use client';

import { useEffect, useState } from 'react';
import FloatCTA from '../components/ui/FloatingCTA';
import EventCard from '../components/features/calendar/EventCard';
import FilterSidebar from '../components/features/calendar/FilterSidebar';
import { getRanges } from '../src/utils/dateHelpers';

export const metadata = {
    title: 'Lịch Kinh Tế & Tin Nóng 24/7 | Cú Thông Thái',
    description: 'Cập nhật tin tức kinh tế nóng hổi, lịch sự kiện tài chính và phân tích tác động thị trường (Vàng, Chứng Khoán, Forex) theo thời gian thực.',
    openGraph: {
        title: 'Cú Thông Thái - Theo dòng sự kiện kinh tế',
        description: 'Đầu tư nhẹ nhàng, kết quả huy hoàng. Cập nhật tin tức nhanh nhất.',
        images: ['/og-home.png'],
    },
};

export default function Home() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedRange, setSelectedRange] = useState('this_week'); // Default to This Week
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        if (events.length === 0) {
            setFilteredEvents([]);
            return;
        }

        const ranges = getRanges();
        const currentRange = ranges[selectedRange];

        if (!currentRange) {
            console.log(`[Filter] Invalid range key: ${selectedRange}`);
            setFilteredEvents(events);
            return;
        }

        const start = currentRange.start.getTime();
        const end = currentRange.end.getTime();

        console.log(`[Filter] Range: ${selectedRange}`, currentRange.start.toLocaleString(), currentRange.end.toLocaleString());

        const filtered = events.filter(e => {
            if (!e.event_time) return false;
            const t = new Date(e.event_time).getTime();
            // console.log(`   - Event: ${e.event_name} Time: ${new Date(e.event_time).toLocaleString()} (${t})`);
            return t >= start && t <= end;
        });

        console.log(`[Filter] Result: ${filtered.length} events found.`);
        setFilteredEvents(filtered);
    }, [events, selectedRange]);

    return (
        <main className="min-h-screen pb-24 bg-black font-sans"> {/* Added pb-24 for FloatingCTA space */}

            {/* --- HEADER SECTION --- */}
            <div className="bg-[#111] border-b border-gray-800 py-6 mb-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-theme-yellow mb-2 uppercase tracking-tighter">
                        CÚ THÔNG THÁI
                    </h1>
                    <div className="flex flex-col gap-1">
                        <span className="text-white text-lg font-bold uppercase tracking-widest bg-red-600 inline-block px-3 py-1 text-sm rounded self-center transform -skew-x-12">
                            Tin Kinh Tế Nóng 24/7
                        </span>
                        <p className="text-gray-400 text-sm md:text-base mt-2 italic">
                            "Đầu Tư Nhẹ Nhàng - Kết Quả Huy Hoàng"
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">

                {/* --- LEFT SIDEBAR --- */}
                <FilterSidebar
                    selectedRange={selectedRange}
                    onSelectRange={setSelectedRange}
                />

                {/* --- MAIN CONTENT --- */}
                <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex item from overflowing */}

                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-yellow"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-center p-4 border border-red-500 rounded bg-red-900/20">
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && filteredEvents.length === 0 && (
                        <div className="text-center text-gray-500 py-10 bg-[#111] rounded-lg border border-gray-800">
                            <span className="text-2xl mr-2">📭</span>
                            Không có tin tức nào trong khung giờ này.
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id || Math.random()} event={event} />
                        ))}
                    </div>
                </div>

            </div> {/* End container */}

            <FloatCTA />
        </main>
    );
}
