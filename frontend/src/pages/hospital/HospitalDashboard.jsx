import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Send, Activity, AlertCircle, History } from 'lucide-react';

const HospitalDashboard = () => {
    const [formData, setFormData] = useState({ blood_group: 'O+', units: 1, is_emergency: false });
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchHistory = async () => {
        const res = await api.get('/hospital/history');
        setHistory(res.data);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/hospital/request', formData);
            setSuccess('Request processed and units deducted from stock.');
            fetchHistory();
        } catch (err) {
            setError(err.response?.data?.message || 'Request failed.');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Hospital Inventory & Requests</h1>
                <p className="text-gray-500">Fast-track blood sourcing for emergencies</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <div className="flex items-center gap-2 mb-6 text-red-600">
                        <Activity size={24} />
                        <h2 className="text-xl font-bold">New Request</h2>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                            <select 
                                value={formData.blood_group}
                                onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500"
                            >
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Units Needed</label>
                            <input 
                                type="number" 
                                min="1"
                                value={formData.units}
                                onChange={(e) => setFormData({...formData, units: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex items-center gap-2 py-2">
                            <input 
                                type="checkbox" 
                                id="emergency"
                                checked={formData.is_emergency}
                                onChange={(e) => setFormData({...formData, is_emergency: e.target.checked})}
                                className="h-4 w-4 text-red-600 rounded"
                            />
                            <label htmlFor="emergency" className="text-sm font-bold text-red-600">Emergency Case</label>
                        </div>
                        <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                            <Send size={18} /> Send Request
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <History size={24} />
                        <h2 className="text-xl font-bold">Request Log</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Group</th>
                                    <th className="pb-3 text-center">Units</th>
                                    <th className="pb-3">Type</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map(item => (
                                    <tr key={item._id} className="text-sm text-gray-600">
                                        <td className="py-4">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="py-4 font-bold text-red-600">{item.blood_group}</td>
                                        <td className="py-4 text-center">{item.units}</td>
                                        <td className="py-4">
                                            {item.is_emergency ? 
                                                <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">EMERGENCY</span> : 
                                                <span className="text-gray-400">Normal</span>
                                            }
                                        </td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">APPROVED</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {history.length === 0 && <p className="text-center py-10 text-gray-400">No requests found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
