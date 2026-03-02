import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, History, PlusSquare, Droplet } from 'lucide-react';

const DonorDashboard = () => {
    const [units, setUnits] = useState(1);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');

    const fetchHistory = async () => {
        const res = await api.get('/donor/history');
        setHistory(res.data);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/donor/donate', { units });
            setMessage('Donation recorded successfully! Thank you for your contribution.');
            setUnits(1);
            fetchHistory();
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            setMessage('Failed to record donation.');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
                <p className="text-gray-500 max-w-md mx-auto">Your selfless act saves lives. Track your donations here.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 text-red-600">
                        <PlusSquare size={24} />
                        <h2 className="text-xl font-bold">Log New Donation</h2>
                    </div>
                    {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">{message}</div>}
                    <form onSubmit={handleDonate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Units of Blood (ml)</label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="5"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                />
                                <span className="text-gray-500 whitespace-nowrap">Units</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">1 Standard unit is approx. 450ml</p>
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-md">
                            Confirm Donation
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-gray-800">
                        <History size={24} />
                        <h2 className="text-xl font-bold">Contribution History</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 max-h-80 pr-2">
                        {history.length === 0 ? (
                            <div className="text-center py-10">
                                <Droplet className="mx-auto text-gray-200 mb-2" size={40} />
                                <p className="text-gray-400">No donations recorded yet.</p>
                            </div>
                        ) : (
                            history.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-800">{item.units} Units</p>
                                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                        Completed
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
