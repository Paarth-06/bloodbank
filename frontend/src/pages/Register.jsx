import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Droplets, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'donor', blood_group: 'O+'
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                    <p className="text-gray-600">Your account is pending admin approval. You will be redirected to the login page shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Droplets className="mx-auto text-red-600" size={48} />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded">{error}</p>}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option value="donor">Donor</option>
                                    <option value="hospital">Hospital</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                <select value={formData.blood_group} onChange={(e) => setFormData({...formData, blood_group: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>

                        <button type="submit" className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors">Register</button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-sm text-red-600 hover:text-red-500 font-medium">Already have an account? Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
