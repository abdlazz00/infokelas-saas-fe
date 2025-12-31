import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import UserDropdown from '../components/UserDropdown';
import Skeleton from '../components/Skeleton';
import api from '../services/api';

// --- IMPORT KOMPONEN PENGUMUMAN ---
import AnnouncementSlider from '../components/AnnouncementSlider';

export default function Dashboard() {
    const navigate = useNavigate();
    
    // State User
    const [user, setUser] = useState({ name: 'Mahasiswa', email: '' });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    // 1. FETCH JADWAL HARI INI
    const { data: todaySchedule = [], isLoading: scheduleLoading } = useQuery({
        queryKey: ['schedules', 'today'],
        queryFn: async () => {
            const res = await api.get('/schedules', {
                params: { today: true }
            });
            return res.data.data; 
        },
        staleTime: 60000,
    });

    // 2. FETCH PENGUMUMAN TERBARU (Limit 3)
    const { data: announcements = [] } = useQuery({
        queryKey: ['announcements', 'limit-3'], // Key unik biar gak bentrok sama page "Lihat Semua"
        queryFn: async () => {
            // Request ke API dengan parameter limit
            const res = await api.get('/announcements', {
                params: { limit: 3 }
            });
            return res.data.data;
        },
        staleTime: 300000, // Cache 5 menit
    });

    // Helper untuk ucapan waktu
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <Layout>
            {/* --- HEADER --- */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Beranda</h1>
                </div>
                
                {/* User Dropdown di Header */}
                <div>
                    <UserDropdown placement="bottom" />
                </div>
            </header>

            {/* --- CONTENT --- */}
            <div className="p-6 md:p-8 space-y-8 page-enter pb-24 md:pb-8">
                
                {/* 1. WELCOME BANNER */}
                <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 p-8 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-brand-100 font-medium mb-1 text-sm">{getGreeting()},</p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h2>
                        <p className="text-brand-100 text-sm opacity-90">{user.email}</p>
                    </div>
                    {/* Hiasan Background */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 blur-2xl rounded-full -mr-10"></div>
                    <div className="absolute right-20 bottom-0 h-32 w-32 bg-indigo-500/30 rounded-full blur-xl"></div>
                </div>

                {/* --- 1.5 PENGUMUMAN (SLIDER) --- */}
                {/* Kita oper data 'announcements' ke komponen slider */}
                <AnnouncementSlider data={announcements} />

                {/* 2. STATISTIK / MENU CEPAT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Card Materi */}
                    <div 
                        onClick={() => navigate('/classes')}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 transition group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            <i className="fa-solid fa-book-open"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Materi</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Download Materi</p>
                        </div>
                    </div>

                    {/* Card Tugas */}
                    <div 
                        onClick={() => navigate('/classes')} 
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 transition group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            <i className="fa-solid fa-clipboard-list"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Tugas</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Cek Deadline</p>
                        </div>
                    </div>
                </div>

                {/* 3. JADWAL HARI INI */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Jadwal Kuliah Hari Ini</h3>
                        <button onClick={() => navigate('/schedule')} className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline">
                            Lihat Semua
                        </button>
                    </div>

                    <div className="space-y-3">
                        {scheduleLoading ? (
                            // --- SKELETON LOADING ---
                            <>
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                        <Skeleton className="hidden md:block w-16 h-16 rounded-xl shrink-0" />
                                        
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-6 w-3/4 md:w-1/3 rounded-md" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-4 w-24 rounded-md" />
                                                <Skeleton className="h-4 w-16 rounded-md" />
                                            </div>
                                        </div>
                                        
                                        <Skeleton className="hidden md:block h-8 w-20 rounded-lg" />
                                    </div>
                                ))}
                            </>
                        ) : todaySchedule.length > 0 ? (
                            todaySchedule.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition hover:border-brand-300 dark:hover:border-brand-700">
                                    {/* Kotak Tanggal/Jam */}
                                    <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0">
                                        <span className="text-[10px] font-bold uppercase text-slate-400">HARI</span>
                                        <span className="text-lg font-bold">{item.day.substring(0,3).toUpperCase()}</span>
                                    </div>

                                    {/* Detail Matkul */}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{item.subject_name}</h4>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            <span className="flex items-center gap-1">
                                                <i className="fa-solid fa-user-tie text-xs"></i> {item.lecturer}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <i className="fa-solid fa-location-dot text-xs"></i> {item.room}
                                            </span>
                                            <span className="flex items-center gap-1 md:hidden">
                                                <i className="fa-regular fa-clock text-xs"></i> {item.time}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Jam (Desktop) */}
                                    <div className="hidden md:block text-right">
                                        <div className="inline-block px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-bold">
                                            {item.time} WIB
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-center">
                                <p className="text-slate-500 dark:text-slate-400">Tidak ada jadwal kuliah hari ini.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Layout>
    );
}