import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import useTheme from '../hooks/useTheme';
import api from '../services/api';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme(); 
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State Modal
    const menuRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    const { data: user } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/profile');
            return res.data.data;
        },
        initialData: () => JSON.parse(localStorage.getItem('user')) || { name: 'Mahasiswa' },
        staleTime: 60000,
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setIsMenuOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] transition-colors duration-300">
            
            <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center gap-1 transition ${isActive('/dashboard') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 hover:text-brand-600'}`}>
                <i className="fa-solid fa-house text-xl mb-0.5"></i>
                <span className="text-[10px] font-medium">Home</span>
            </button>

            <button onClick={() => navigate('/classes')} className={`flex flex-col items-center gap-1 transition ${isActive('/classes') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 hover:text-brand-600'}`}>
                <i className="fa-solid fa-book-open text-xl mb-0.5"></i>
                <span className="text-[10px] font-medium">Kelas</span>
            </button>

            <div className="relative -top-6">
                <button onClick={() => navigate('/classes', { state: { openJoinModal: true } })} className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/40 active:scale-95 transition ring-4 ring-gray-50 dark:ring-slate-950">
                    <i className="fa-solid fa-plus text-xl"></i>
                </button>
            </div>

            <button onClick={() => navigate('/schedule')} className={`flex flex-col items-center gap-1 transition ${isActive('/schedule') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 hover:text-brand-600'}`}>
                <i className="fa-regular fa-calendar-days text-xl mb-0.5"></i>
                <span className="text-[10px] font-medium">Jadwal</span>
            </button>

            {/* MENU AKUN */}
            <div className="relative" ref={menuRef}>
                {isMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-4 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden page-enter z-50">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                        </div>
                        <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition">
                            <i className="fa-regular fa-user w-4"></i> Profil
                        </button>
                        <button onClick={toggleTheme} className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition border-t border-gray-50 dark:border-slate-700">
                            {theme === 'dark' ? <><i className="fa-regular fa-sun w-4 text-yellow-400"></i> Terang</> : <><i className="fa-regular fa-moon w-4 text-slate-400"></i> Gelap</>}
                        </button>
                        <button onClick={handleLogoutClick} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition border-t border-gray-50 dark:border-slate-700">
                            <i className="fa-solid fa-arrow-right-from-bracket w-4"></i> Keluar
                        </button>
                    </div>
                )}

                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`flex flex-col items-center gap-1 transition ${isMenuOpen ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 hover:text-brand-600'}`}>
                    {user?.avatar_url ? (
                        <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden mb-0.5">
                            <img src={user.avatar_url} alt="Ava" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <i className="fa-regular fa-user text-xl mb-0.5"></i>
                    )}
                    <span className="text-[10px] font-medium">Akun</span>
                </button>
            </div>

            {/* --- MODAL CONFIRM LOGOUT (Overlay) --- */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl relative border border-gray-100 dark:border-slate-800 p-6 text-center">
                        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            <i className="fa-solid fa-arrow-right-from-bracket text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Konfirmasi Keluar</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Apakah Anda yakin ingin keluar dari aplikasi?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Batal</button>
                            <button onClick={confirmLogout} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/20 transition">Ya, Keluar</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}