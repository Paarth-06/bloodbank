import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Users, Building2, Droplet, UserPlus, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ donors: 0, hospitals: 0, pending: 0, stock: [] });
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users/pending')
            ]);
            setStats(statsRes.data);
            setPendingUsers(pendingRes.data);
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.post(`/admin/users/approve/${id}`);
            fetchData();
        } catch (err) {
            alert("Approve failed");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    const COLORS = ['#ef4444', '#f87171', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#ef4444', '#f87171'];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
                <p className="text-gray-500">Monitor blood inventory and user requests</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Users className="text-blue-500" />} label="Total Donors" value={stats.donors} color="border-blue-500" />
                <StatCard icon={<Building2 className="text-green-500" />} label="Hospitals" value={stats.hospitals} color="border-green-500" />
                <StatCard icon={<Clock className="text-yellow-500" />} label="Pending Users" value={stats.pending} color="border-yellow-500" />
                <StatCard icon={<Droplet className="text-red-500" />} label="Avg. Units" value={stats.stock.reduce((a, b) => a + (b.units || 0), 0)} color="border-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Stock Redistribution (units)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.stock}>
                                <XAxis dataKey="blood_group" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="units" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Pending Approvals</h3>
                    <div className="overflow-y-auto max-h-64 space-y-4">
                        {pendingUsers.length === 0 ? (
                            <p className="text-center text-gray-400 py-8">No pending approvals</p>
                        ) : (
                            pendingUsers.map(user => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{user.role}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleApprove(user._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors"
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} flex items-center gap-4`}>
        <div className="bg-gray-50 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
