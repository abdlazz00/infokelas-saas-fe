import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import api from '../services/api';
import Skeleton from '../components/Skeleton';

export default function Announcements() {
    const navigate = useNavigate();

    // Fetch SEMUA data (Tanpa Limit)
    const { data: allAnnouncements = [], isLoading } = useQuery({
        queryKey: ['announcements', 'all'], // Key beda dengan dashboard biar cache-nya misah
        queryFn: async () => {
            const res = await api.get('/announcements');
            return res.data.data;
        },
        staleTime: 60000,
    });

    // Helper Warna Badge & Border (Konsisten dengan Dashboard)
    const getBadgeColor = (type) => {
        switch (type) {
            case 'danger': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900';
            case 'warning': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900';
            default: return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900';
        }
    };

    const getBorderColor = (type) => {
        switch (type) {
            case 'danger': return 'hover:border-red-300 dark:hover:border-red-700';
            case 'warning': return 'hover:border-amber-300 dark:hover:border-amber-700';
            default: return 'hover:border-brand-300 dark:hover:border-brand-700';
        }
    };

    return (
        <Layout>
            {/* --- STICKY HEADER --- */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-20 flex items-center gap-4 transition-colors duration-300">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition active:scale-95"
                >
                    <i className="fa-solid fa-arrow-left text-slate-600 dark:text-slate-400"></i>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        Semua Pengumuman
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Informasi terkini seputar akademik
                    </p>
                </div>
            </div>

            {/* --- LIST PENGUMUMAN --- */}
            <div className="p-6 pb-24 space-y-4 max-w-3xl mx-auto page-enter">
                {isLoading ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-20 rounded" />
                                <Skeleton className="h-4 w-24 rounded" />
                            </div>
                            <Skeleton className="h-6 w-3/4 rounded" />
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                    ))
                ) : allAnnouncements.length > 0 ? (
                    allAnnouncements.map((item) => (
                        <div 
                            key={item.id} 
                            className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition group ${getBorderColor(item.type)}`}
                        >
                            {/* Header Item */}
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${getBadgeColor(item.type)}`}>
                                    {item.type === 'info' ? 'Informasi' : item.type === 'warning' ? 'Penting' : 'Darurat'}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <i className="fa-regular fa-clock"></i> {item.created_at}
                                </span>
                            </div>
                            
                            {/* Judul */}
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 leading-snug">
                                {item.title}
                            </h3>

                            {/* Konten Text */}
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
                                {item.content}
                            </p>

                            {/* Gambar (Jika Ada) */}
                            {item.image_url && (
                                <div className="mb-4">
                                    <img 
                                        src={item.image_url} 
                                        alt="Banner" 
                                        className="w-full h-48 sm:h-64 object-cover rounded-xl border border-gray-100 dark:border-slate-800" 
                                    />
                                </div>
                            )}
                            
                            {/* Footer Item */}
                            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <i className="fa-solid fa-user-pen text-[10px]"></i>
                                    </div>
                                    <span>Ditulis oleh <span className="font-medium text-slate-600 dark:text-slate-300">{item.author}</span></span>
                                </div>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    // Empty State
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 mb-4 text-2xl">
                            <i className="fa-regular fa-folder-open"></i>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">Belum ada pengumuman saat ini.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}