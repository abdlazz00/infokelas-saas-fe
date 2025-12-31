import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import api from '../services/api';
import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton';

export default function MyClasses() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const queryClient = useQueryClient(); 

    // --- 1. State Modal Result (Sukses/Gagal) ---
    const [resultModal, setResultModal] = useState({ 
        show: false, 
        type: 'success', // 'success' | 'error'
        message: '' 
    });

    // State Modal Input
    const [showModal, setShowModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    // Fetching Data
    const { data: classes = [], isLoading } = useQuery({
        queryKey: ['my-classrooms'], 
        queryFn: async () => {
            const response = await api.get('/my-classrooms');
            return response.data.data;
        },
        staleTime: 60000, 
    });

    // Auto-open modal via navigation state
    useEffect(() => {
        if (location.state?.openJoinModal) {
            setShowModal(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleJoinClass = async (e) => {
        e.preventDefault();
        setIsJoining(true);
        try {
            const response = await api.post('/join-class', { code: joinCode });
            
            // --- SUKSES ---
            setShowModal(false); // Tutup modal input
            setJoinCode('');     // Reset form
            
            // Tampilkan Modal Sukses
            setResultModal({
                show: true,
                type: 'success',
                message: response.data.message || 'Berhasil bergabung ke kelas!'
            });
            
            // Refresh Data
            queryClient.invalidateQueries({ queryKey: ['my-classrooms'] }); 
            
        } catch (error) {
            // --- GAGAL ---
            // Tampilkan Modal Error (Layer paling atas)
            setResultModal({
                show: true,
                type: 'error',
                message: error.response?.data?.message || "Gagal bergabung. Periksa kode kelas."
            });
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <Layout>
            {/* Header Page */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Kelas Saya</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Daftar mata kuliah aktif</p>
                </div>
            </header>

            {/* Content Page */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                <div className="max-w-6xl mx-auto page-enter">
                    
                    {/* Tombol Gabung Kelas */}
                    <div className="flex justify-end mb-6">
                        <button onClick={() => setShowModal(true)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-900 font-bold py-2.5 px-5 rounded-xl shadow-sm transition flex items-center gap-2 active:scale-95">
                            <i className="fa-solid fa-plus"></i> Gabung Kelas Baru
                        </button>
                    </div>

                    {/* Grid Kelas */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <Skeleton className="h-48 w-full rounded-none" />
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                                            <Skeleton className="h-4 w-1/2 rounded" />
                                        </div>
                                        <Skeleton className="h-px w-full" />
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-3 w-20 rounded" />
                                            <Skeleton className="w-4 h-4 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : classes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classes.map((cls) => (
                                <div 
                                    key={cls.id} 
                                    onClick={() => navigate(`/class/${cls.id}`)}
                                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                                >
                                    {/* --- CARD HEADER --- */}
                                    <div className="h-48 bg-gradient-to-br from-brand-600 to-indigo-700 p-6 relative overflow-hidden flex flex-col justify-between">
                                        <i className="fa-solid fa-layer-group absolute -right-6 -bottom-8 text-9xl text-white/5 group-hover:scale-110 group-hover:rotate-6 transition duration-700 ease-out"></i>
                                        <div className="relative z-10">
                                            <h3 className="text-white font-extrabold text-3xl leading-tight drop-shadow-md group-hover:text-brand-50 transition-colors">
                                                {cls.name}
                                            </h3>
                                            <div className="w-12 h-1 bg-white/30 rounded-full mt-3"></div>
                                        </div>
                                        <div className="relative z-10 flex flex-wrap gap-2 mt-4">
                                            {cls.university && (
                                                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                                                    <i className="fa-solid fa-building-columns text-[9px] opacity-80"></i> {cls.university}
                                                </span>
                                            )}
                                            {cls.major && (
                                                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                                                    <i className="fa-solid fa-graduation-cap text-[9px] opacity-80"></i> {cls.major}
                                                </span>
                                            )}
                                            {cls.semester && (
                                                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-md border border-amber-400 flex items-center gap-1.5">
                                                    <i className="fa-solid fa-layer-group text-[9px]"></i> Sem. {cls.semester}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* --- CARD BODY --- */}
                                    <div className="p-5 flex-1 flex flex-col justify-end bg-white dark:bg-slate-900">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-base ring-2 ring-white dark:ring-slate-700 shadow-sm">
                                                <i className="fa-solid fa-user-tie"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Admin Kelas</p>
                                                <span className="text-sm text-slate-800 dark:text-white font-bold line-clamp-1">{cls.teacher?.name}</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                            <span className="text-[11px] font-bold">Masuk Kelas</span>
                                            <i className="fa-solid fa-arrow-right-long transform group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-500 mb-4">
                                <i className="fa-solid fa-layer-group text-3xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-white">Belum ada kelas</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6 max-w-xs mx-auto">Anda belum terdaftar di kelas manapun.</p>
                            <button onClick={() => setShowModal(true)} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition text-sm">
                                Gabung Kelas Sekarang
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL INPUT KODE --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-gray-100 dark:border-slate-800 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gabung Kelas</h3>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition flex items-center justify-center">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleJoinClass}>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Kode Kelas</label>
                                <input 
                                    type="text" 
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="CONTOH: XY7A9" 
                                    className="w-full text-center text-3xl uppercase tracking-[0.3em] font-bold py-5 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white rounded-2xl focus:border-brand-500 focus:ring-0 outline-none transition placeholder:text-slate-300"
                                    maxLength={10}
                                    autoFocus
                                />
                                <p className="text-center text-[10px] text-slate-400 mt-2">Minta kode unik 5-10 karakter kepada Admin Kelas.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isJoining || !joinCode} 
                                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isJoining ? (
                                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Memproses...</>
                                ) : (
                                    'Gabung Sekarang'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL RESULT SUKSES/GAGAL (BARU) --- */}
            {resultModal.show && (
                // z-[60] agar muncul di atas modal input (jika modal input masih terbuka/error)
                <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl relative border border-gray-100 dark:border-slate-800 p-6 text-center">
                        
                        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${resultModal.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            <i className={`fa-solid ${resultModal.type === 'success' ? 'fa-check text-3xl' : 'fa-triangle-exclamation text-2xl'}`}></i>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {resultModal.type === 'success' ? 'Berhasil!' : 'Ups, Gagal!'}
                        </h3>

                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 break-words">
                            {resultModal.message}
                        </p>

                        <button 
                            onClick={() => setResultModal({ ...resultModal, show: false })}
                            className="w-full py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition"
                        >
                            {resultModal.type === 'success' ? 'Oke, Mengerti' : 'Coba Lagi'}
                        </button>
                    </div>
                </div>
            )}

        </Layout>
    );
}