import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // <--- 1. Import React Query
import api from '../services/api';
import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton';

export default function SubjectMaterials() {
    const { classId, subjectId } = useParams();
    const navigate = useNavigate();

    // --- 2. REFACTOR: Fetching Data dengan useQuery ---
    const { data: materials = [], isLoading } = useQuery({
        queryKey: ['subject-materials', subjectId], // Key unik per Subject ID
        queryFn: async () => {
            const response = await api.get('/materials', {
                params: { subject_id: subjectId }
            });
            return response.data.data;
        },
        staleTime: 60000, // Data dianggap segar 1 menit
    });

    return (
        <Layout>
            {/* Header Sticky */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-20 flex items-center gap-4 transition-colors duration-300">
                <button onClick={() => navigate(`/class/${classId}`)} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition">
                    <i className="fa-solid fa-arrow-left text-slate-600 dark:text-slate-400"></i>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white">Detail Materi</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Daftar file yang tersedia</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 pb-24 md:pb-8 flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-4 page-enter">
                    {isLoading ? (
                        // --- SKELETON LOADING LIST ---
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex gap-4 items-start">
                                {/* Icon Skeleton */}
                                <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                                
                                <div className="flex-1 space-y-3">
                                    {/* Judul Skeleton */}
                                    <Skeleton className="h-5 w-1/3 rounded" />
                                    
                                    {/* Deskripsi Skeleton (2 baris) */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full rounded" />
                                        <Skeleton className="h-4 w-2/3 rounded" />
                                    </div>
                                    
                                    {/* Button Skeleton */}
                                    <Skeleton className="h-8 w-28 rounded-lg" />
                                </div>
                            </div>
                        ))
                    ) : materials.length > 0 ? (
                        materials.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 hover:border-brand-300 dark:hover:border-brand-700 transition shadow-sm flex gap-4 items-start group">
                                {/* Icon File */}
                                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                                    <i className={`fa-solid ${item.file_path ? 'fa-file-pdf' : 'fa-link'}`}></i>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-white">{item.title}</h3>
                                    {/* Deskripsi dengan Prose Dark Mode */}
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3 prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: item.description }}></div>
                                    
                                    {item.file_url && (
                                        <a href={item.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-900/40 transition">
                                            <i className="fa-solid fa-download"></i> Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Empty State
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                            <i className="fa-regular fa-folder-open text-4xl text-slate-300 dark:text-slate-600 mb-3"></i>
                            <p className="text-slate-500 dark:text-slate-400">Folder ini kosong.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}