'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Added for refresh if needed
import MacroUpdateModal from '../../components/MacroUpdateModal';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [isMacroModalOpen, setIsMacroModalOpen] = useState(false);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        event_name: '',
        event_time: '',
        currency: 'USD',
        forecast: '',
        actual: '',
        previous: '',
        impact_level: 'High'
    });
    const [editMode, setEditMode] = useState(null); // ID of event being edited

    const PIN_CODE = "9999";

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchEvents();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (pin === PIN_CODE) {
            setIsAuthenticated(true);
        } else {
            alert("Wrong PIN!");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            event_name: '',
            event_time: '',
            currency: 'USD',
            forecast: '',
            actual: '',
            previous: '',
            impact_level: 'High'
        });
        setEditMode(null);
    };

    const handleEdit = (event) => {
        setEditMode(event.id);
        // Format time for datetime-local input (YYYY-MM-DDTHH:mm)
        const date = new Date(event.event_time);
        const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

        setFormData({
            event_name: event.event_name,
            event_time: localIso,
            currency: event.currency,
            forecast: event.forecast || '',
            actual: event.actual || '',
            previous: event.previous || '',
            impact_level: event.impact_level || 'High'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure time is ISO
        const payload = {
            ...formData,
            event_time: new Date(formData.event_time).toISOString()
        };

        const url = editMode ? `/api/events/${editMode}` : '/api/events';
        const method = editMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                resetForm();
                fetchEvents();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save event");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await fetch(`/api/events/${id}`, { method: 'DELETE' });
            fetchEvents();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRunAI = async (id) => {
        setAnalyzingId(id);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: id })
            });
            const data = await res.json();
            if (res.ok) {
                alert("AI Analysis Updated!\n" + data.ai_sentiment);
                fetchEvents();
            } else {
                alert("AI Error: " + (data.error || JSON.stringify(data)));
            }
        } catch (error) {
            alert("Network Error");
        } finally {
            setAnalyzingId(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded border border-gray-700">
                    <h2 className="text-xl mb-4 font-bold text-theme-yellow">Admin Access</h2>
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter PIN"
                        className="p-2 rounded bg-black border border-gray-600 w-full mb-4 text-white"
                        autoFocus
                    />
                    <button type="submit" className="w-full bg-theme-yellow text-black font-bold py-2 rounded">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-theme-yellow">Admin Dashboard</h1>
                <button
                    onClick={() => setIsMacroModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                    📊 Manage Macro Data
                </button>
            </div>

            <MacroUpdateModal
                isOpen={isMacroModalOpen}
                onClose={() => setIsMacroModalOpen(false)}
                onSuccess={() => {
                    alert("Macro Data Updated");
                    router.refresh(); // Refresh content
                }}
            />

            {/* Input Form */}
            <div className="bg-gray-900 p-6 rounded border border-gray-700 mb-8">
                <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input name="event_name" value={formData.event_name} onChange={handleInputChange} placeholder="Event Name" className="p-2 rounded bg-black border border-gray-600 text-white" required />
                    <input name="currency" value={formData.currency} onChange={handleInputChange} placeholder="Currency" className="p-2 rounded bg-black border border-gray-600 text-white" required />
                    <input name="event_time" type="datetime-local" value={formData.event_time} onChange={handleInputChange} className="p-2 rounded bg-black border border-gray-600 text-white" required />
                    <select name="impact_level" value={formData.impact_level} onChange={handleInputChange} className="p-2 rounded bg-black border border-gray-600 text-white">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <input name="previous" value={formData.previous} onChange={handleInputChange} placeholder="Previous (e.g. 100K)" className="p-2 rounded bg-black border border-gray-600 text-white" />
                    <input name="forecast" value={formData.forecast} onChange={handleInputChange} placeholder="Forecast (e.g. 105K)" className="p-2 rounded bg-black border border-gray-600 text-white" />
                    <input name="actual" value={formData.actual} onChange={handleInputChange} placeholder="Actual (e.g. 110K)" className="p-2 rounded bg-black border border-gray-600 text-white" />

                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-theme-yellow text-black font-bold py-2 rounded">
                            {editMode ? 'Update' : 'Add'}
                        </button>
                        {editMode && (
                            <button type="button" onClick={resetForm} className="bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-gray-400 border-b border-gray-700">
                            <th className="p-3">Time</th>
                            <th className="p-3">Event</th>
                            <th className="p-3">Prev / Fcst / Act</th>
                            <th className="p-3">Impact</th>
                            <th className="p-3">AI Sentiment</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-900">
                                <td className="p-3 text-sm">{new Date(event.event_time).toLocaleString()}</td>
                                <td className="p-3 font-semibold">{event.event_name} <span className="text-gray-500 text-xs">({event.currency})</span></td>
                                <td className="p-3 font-mono text-sm text-gray-300">
                                    {event.previous} / {event.forecast} / <span className={event.actual ? 'text-white font-bold' : 'text-gray-600'}>{event.actual || '-'}</span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${event.impact_level === 'High' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                        {event.impact_level}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {event.ai_sentiment === 'BULLISH' && <span className="text-green-500 font-bold">BULLISH</span>}
                                    {event.ai_sentiment === 'BEARISH' && <span className="text-red-500 font-bold">BEARISH</span>}
                                    {event.ai_sentiment === 'NEUTRAL' && <span className="text-gray-500">NEUTRAL</span>}
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => handleEdit(event)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                    <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-300">Del</button>
                                    <button
                                        onClick={() => handleRunAI(event.id)}
                                        disabled={analyzingId === event.id}
                                        className={`px-3 py-1 bg-purple-900 text-purple-200 rounded hover:bg-purple-800 ${analyzingId === event.id ? 'opacity-50' : ''}`}
                                    >
                                        {analyzingId === event.id ? 'Thinking...' : 'Run AI'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
