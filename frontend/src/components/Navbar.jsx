import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Droplets } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2">
                <Droplets className="text-red-600" size={32} />
                <span className="text-xl font-bold text-gray-800 tracking-tight text-red-600">BLOOD CONNECT</span>
            </Link>

            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-red-600 font-medium">Login</Link>
                        <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
