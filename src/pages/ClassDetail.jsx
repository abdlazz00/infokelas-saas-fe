import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import api from '../services/api';
import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton'; 

export default function ClassDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State UI
    const [activeTab, setActiveTab] = useState('materi'); 
    const [selectedTask, setSelectedTask] = useState(null);

    // --- QUERIES ---
    
    // Query A: Detail Kelas
    const { data: classData, isLoading: loadingClass } = useQuery({
        queryKey: ['classroom', id], 
        queryFn: async () => {
            const res = await api.get(`/classrooms/${id}`);
            return res.data.data;
        },
        staleTime: 60000,
    });

    // Query B: Materi
    const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
        queryKey: ['classroom-subjects', id], 
        queryFn: async () => {
            const res = await api.get(`/classrooms/${id}/subjects`);
            return res.data.data;
        },
        staleTime: 60000,
    });

    // Query C: Tugas
    const { data: assignments = [], isLoading: loadingAssignments } = useQuery({
        queryKey: ['classroom-assignments', id], 
        queryFn: async () => {
            const res = await api.get(`/classrooms/${id}/assignments`);
            return res.data.data;
        },
        staleTime: 60000,
    });

    if (!classData && !loadingClass) return null; 

    return (
        <Layout>
            {/* Header Kelas */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-20 transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigate('/classes')} className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-4 flex items-center gap-1 font-medium">
                        <i className="fa-solid fa-arrow-left"></i> Kembali
                    </button>
                    
                    {/* Banner Info Kelas */}
                    {loadingClass ? (
                        <Skeleton className="h-48 rounded-2xl w-full" />
                    ) : (
                        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-800 p-6 flex flex-col justify-end relative overflow-hidden shadow-lg min-h-[180px]">
                            <i className="fa-solid fa-building-columns absolute right-8 -top-4 text-9xl text-white/10"></i>
                            
                            <div className="relative z-10">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {classData?.university && (
                                        <span className="px-2 py-1 rounded-md bg-white/20 text-white text-[10px] font-bold backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                                            <i className="fa-solid fa-building-columns"></i> {classData.university}
                                        </span>
                                    )}
                                    {classData?.major && (
                                        <span className="px-2 py-1 rounded-md bg-white/20 text-white text-[10px] font-bold backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                                            <i className="fa-solid fa-graduation-cap"></i> {classData.major}
                                        </span>
                                    )}
                                    {classData?.semester && (
                                        <span className="px-2 py-1 rounded-md bg-amber-500/80 text-white text-[10px] font-bold backdrop-blur-sm flex items-center gap-1.5">
                                            <i className="fa-solid fa-layer-group"></i> Sem. {classData.semester}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{classData?.name}</h1>
                            </div>
                        </div>
                    )}

                    {/* Tabs Menu */}
                    <div className="flex gap-8 mt-6 border-b border-gray-100 dark:border-slate-800">
                        <button 
                            onClick={() => setActiveTab('materi')}
                            className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === 'materi' ? 'text-brand-600 border-brand-600' : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Materi
                        </button>
                        <button 
                            onClick={() => setActiveTab('tugas')}
                            className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === 'tugas' ? 'text-brand-600 border-brand-600' : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Tugas
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-8">
                <div className="max-w-4xl mx-auto page-enter">
                    
                    {/* --- TAB 1: MATERI FOLDER --- */}
                    {activeTab === 'materi' && (
                        loadingSubjects ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                                        <Skeleton className="w-16 h-14 mb-3 rounded-lg" />
                                        <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                                        <Skeleton className="h-3 w-1/2 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : subjects.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {subjects.map((sub) => (
                                    <div 
                                        key={sub.id} 
                                        onClick={() => navigate(`/class/${id}/subject/${sub.id}`)}
                                        className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition cursor-pointer flex flex-col items-center text-center group active:scale-95"
                                    >
                                        <div className="w-16 h-14 mb-3 relative">
                                            <i className="fa-solid fa-folder text-6xl text-yellow-400 group-hover:text-yellow-300 transition drop-shadow-sm"></i>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2 leading-tight">
                                            {sub.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-400 mt-1">{sub.code}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                <p>Tidak ada mata kuliah aktif.</p>
                            </div>
                        )
                    )}

                    {/* --- TAB 2: DAFTAR TUGAS (UPDATED UI) --- */}
                    {activeTab === 'tugas' && (
                        <div className="space-y-3">
                            {loadingAssignments ? (
                                [1, 2].map((i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex gap-4">
                                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/2 rounded" />
                                            <Skeleton className="h-3 w-1/4 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : assignments.length > 0 ? (
                                assignments.map((task) => (
                                    <div 
                                        key={task.id} 
                                        onClick={() => setSelectedTask(task)}
                                        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 hover:border-brand-300 dark:hover:border-brand-700 transition shadow-sm flex gap-3 cursor-pointer group relative overflow-hidden active:scale-[0.99]"
                                    >
                                        {/* Status Bar Kiri (Hiasan) */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.is_overdue ? 'bg-red-500' : 'bg-brand-500'}`}></div>

                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${task.is_overdue ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' : 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'}`}>
                                            <i className="fa-solid fa-clipboard-check"></i>
                                        </div>

                                        {/* Content - Menggunakan min-w-0 agar text truncate berfungsi dalam flex */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            {/* Header: Title & Status */}
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition text-sm leading-tight line-clamp-2">
                                                    {task.title}
                                                </h3>
                                                {/* Badge Status */}
                                                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    task.is_overdue 
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                                                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                }`}>
                                                    {task.is_overdue ? 'Telat' : 'Aktif'}
                                                </span>
                                            </div>

                                            {/* Deskripsi DIHAPUS sesuai request */}

                                            {/* Footer: Meta Info */}
                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <i className="fa-regular fa-clock text-[10px]"></i> {task.deadline}
                                                </span>
                                                {task.is_overdue && (
                                                    <span className="text-red-500 font-semibold flex items-center gap-1">
                                                        <i className="fa-solid fa-hourglass-end text-[10px]"></i> Lewat
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Chevron Icon (Penanda bisa diklik) */}
                                        <div className="self-center text-slate-300 dark:text-slate-600">
                                            <i className="fa-solid fa-chevron-right text-xs"></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <i className="fa-solid fa-mug-hot text-4xl text-slate-300 mb-3"></i>
                                    <h3 className="text-slate-600 dark:text-slate-300 font-bold">Hore! Tidak ada tugas.</h3>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL POPUP DETAIL TUGAS (Tetap sama) --- */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] border border-gray-100 dark:border-slate-800">
                        
                        {/* Header Modal */}
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white pr-8">{selectedTask.title}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${selectedTask.is_overdue ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30'}`}>
                                            {selectedTask.is_overdue ? 'Deadline Lewat' : 'Sedang Aktif'}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <i className="fa-regular fa-clock"></i> {selectedTask.deadline}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Isi Modal (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-3 text-sm uppercase tracking-wider">Instruksi Tugas</h3>
                            
                            <div 
                                className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 mb-6"
                                dangerouslySetInnerHTML={{ __html: selectedTask.description }}
                            ></div>

                            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm border border-blue-100 dark:border-blue-900/30">
                                <i className="fa-solid fa-circle-info mt-0.5 text-blue-500 shrink-0"></i>
                                <div>
                                    <span className="font-bold block mb-1">Catatan Pengumpulan:</span>
                                    Silakan kumpulkan sesuai instruksi dosen sebelum batas waktu berakhir.
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end">
                            <button onClick={() => setSelectedTask(null)} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition shadow-lg shadow-brand-500/20 text-sm">
                                Mengerti
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </Layout>
    );
}