import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'donor') return <Navigate to="/donor" />;
    if (user.role === 'hospital') return <Navigate to="/hospital" />;
    return <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomeRedirect />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        <Route path="/admin/*" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/donor/*" element={
                            <ProtectedRoute allowedRoles={['donor']}>
                                <DonorDashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/hospital/*" element={
                            <ProtectedRoute allowedRoles={['hospital']}>
                                <HospitalDashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
