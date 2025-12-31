import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import useTheme from '../hooks/useTheme';
import api from '../services/api';

export default function UserDropdown({ placement = 'top' }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State Modal Logout
    const dropdownRef = useRef(null);

    const { data: user } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/profile');
            return res.data.data;
        },
        initialData: () => JSON.parse(localStorage.getItem('user')) || { name: 'Mahasiswa', email: 'loading...' },
        staleTime: 60000,
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 1. Trigger Modal
    const handleLogoutClick = () => {
        setIsOpen(false); // Tutup dropdown dulu
        setShowLogoutModal(true); // Buka modal konfirmasi
    };

    // 2. Eksekusi Logout
    const confirmLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const menuPositionClasses = placement === 'top' ? 'bottom-full left-0 mb-3 w-full' : 'top-full right-0 mt-3 w-56';

    return (
        <div className={`relative ${placement === 'bottom' ? 'z-50' : ''}`} ref={dropdownRef}>
            
            {/* MENU POPUP */}
            {isOpen && (
                <div className={`absolute ${menuPositionClasses} bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden page-enter z-50`}>
                    {placement === 'bottom' && (
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 md:hidden">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    )}
                    <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition">
                        <i className="fa-regular fa-user w-4"></i> Profil Saya
                    </button>
                    <button onClick={toggleTheme} className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition border-t border-gray-50 dark:border-slate-700">
                        {theme === 'dark' ? <><i className="fa-regular fa-sun w-4 text-yellow-400"></i> Mode Terang</> : <><i className="fa-regular fa-moon w-4 text-slate-400"></i> Mode Gelap</>}
                    </button>
                    <button onClick={handleLogoutClick} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition border-t border-gray-50 dark:border-slate-700">
                        <i className="fa-solid fa-arrow-right-from-bracket w-4"></i> Keluar
                    </button>
                </div>
            )}

            {/* TOMBOL TRIGGER */}
            <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-3 rounded-xl transition ${placement === 'top' ? 'w-full p-3 hover:bg-slate-50 dark:hover:bg-slate-800' : 'p-1'}`}>
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="Ava" className="w-full h-full object-cover" />
                    ) : (
                        user?.name?.substring(0, 2).toUpperCase()
                    )}
                </div>
                
                {placement === 'top' && (
                    <>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <i className={`fa-solid fa-chevron-up text-xs text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                    </>
                )}
            </button>

            {/* --- MODAL CONFIRM LOGOUT --- */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl relative border border-gray-100 dark:border-slate-800 p-6 text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            <i className="fa-solid fa-arrow-right-from-bracket text-2xl"></i>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Konfirmasi Keluar</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Apakah Anda yakin ingin keluar dari aplikasi?</p>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmLogout}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/20 transition"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}