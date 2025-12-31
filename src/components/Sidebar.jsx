import { useNavigate, useLocation } from 'react-router-dom';
import UserDropdown from './UserDropdown'; // <--- Import Komponen Baru

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 h-full fixed left-0 top-0 bottom-0 z-10 transition-colors duration-300">
            
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-brand-600 flex items-center gap-2">
                    <i className="fa-solid fa-shapes"></i> Infokelas.
                </h2>
            </div>
            
            {/* MENU UTAMA */}
            <nav className="flex-1 p-4 space-y-2">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold ${
                        isActive('/dashboard') 
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' 
                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                >
                    <i className="fa-solid fa-house w-5"></i> Beranda
                </button>

                <button 
                    onClick={() => navigate('/classes')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold ${
                        isActive('/classes') 
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' 
                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                >
                    <i className="fa-solid fa-book w-5"></i> Kelas Saya
                </button>

                <button 
                    onClick={() => navigate('/schedule')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold ${
                        isActive('/schedule') 
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' 
                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                >
                    <i className="fa-regular fa-calendar w-5"></i> Jadwal
                </button>
            </nav>

            {/* FOOTER SIDEBAR (Sekarang pakai Dropdown) */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                <UserDropdown />
            </div>
        </aside>
    );
}