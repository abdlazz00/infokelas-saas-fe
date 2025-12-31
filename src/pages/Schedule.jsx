import { useQuery } from '@tanstack/react-query'; // <--- 1. Import React Query
import api from '../services/api';
import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton';

export default function Schedule() {
    // --- 2. REFACTOR: Ganti useState/useEffect dengan useQuery ---
    // Kita set default value '[]' agar tidak error saat grouping data belum masuk
    const { data: schedules = [], isLoading } = useQuery({
        queryKey: ['schedules'], // PENTING: Key ini SAMA dengan Dashboard agar berbagi Cache
        queryFn: async () => {
            const response = await api.get('/schedules');
            return response.data.data; 
        },
        staleTime: 60000, // Data dianggap segar 1 menit (sama dengan Dashboard)
    });

    const daysOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    // Logic grouping tetap sama, menggunakan data dari React Query
    const groupedSchedules = daysOrder.reduce((acc, day) => {
        const classesToday = schedules.filter(s => s.day === day);
        if (classesToday.length > 0) {
            acc[day] = classesToday;
        }
        return acc;
    }, {});

    return (
        <Layout>
            {/* Header Page */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Jadwal Kuliah</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Agenda akademik mingguan</p>
                </div>
            </header>

            {/* Content Page */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                <div className="max-w-3xl mx-auto page-enter space-y-8">

                    {isLoading ? (
                        // --- SKELETON LOADING TIMELINE ---
                        [1, 2].map((day) => (
                            <div key={day} className="relative pl-4 md:pl-0">
                                {/* Skeleton Header Hari */}
                                <div className="flex items-center gap-3 mb-6 py-2">
                                    <Skeleton className="w-3 h-3 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded" />
                                </div>

                                {/* Skeleton List Jadwal */}
                                <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-1.5 pl-6 pb-4">
                                    {[1, 2].map((item) => (
                                        <div key={item} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative">
                                            <div className="absolute top-8 -left-[31px] w-4 h-0.5 bg-slate-200 dark:bg-slate-800"></div>
                                            <div className="flex-1 w-full space-y-3">
                                                <Skeleton className="h-6 w-2/3 rounded" />
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-5 w-24 rounded" />
                                                    <Skeleton className="h-5 w-16 rounded" />
                                                </div>
                                            </div>
                                            <div className="w-full md:w-auto md:pl-6 md:border-l md:border-slate-100 dark:border-slate-800 space-y-2">
                                                <Skeleton className="h-3 w-20 rounded" />
                                                <Skeleton className="h-4 w-32 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : Object.keys(groupedSchedules).length > 0 ? (
                        
                        Object.keys(groupedSchedules).map((day) => (
                            <div key={day} className="relative pl-4 md:pl-0">
                                {/* Label Hari (Sticky) */}
                                <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur py-2 z-10 mb-3 flex items-center gap-3 transition-colors duration-300">
                                    <div className="w-3 h-3 rounded-full bg-brand-500 shadow-sm shadow-brand-500/50"></div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{day}</h2>
                                </div>
                                
                                {/* List Mata Kuliah */}
                                <div className="space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-1.5 pl-6 pb-4 transition-colors duration-300">
                                    {groupedSchedules[day].map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition group relative"
                                        >
                                            {/* Garis Horizontal Timeline */}
                                            <div className="absolute top-8 -left-[31px] w-4 h-0.5 bg-slate-200 dark:bg-slate-800 group-hover:bg-brand-300 dark:group-hover:bg-brand-700 transition"></div>
                                            
                                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{item.subject_name}</h3>
                                                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-xs font-semibold transition-colors duration-300">
                                                            <i className="fa-regular fa-clock text-brand-500 dark:text-brand-400"></i> {item.time} WIB
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-xs font-semibold transition-colors duration-300">
                                                            <i className="fa-solid fa-location-dot text-red-400 dark:text-red-500"></i> R. {item.room}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* BAGIAN DOSEN */}
                                                <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l md:border-slate-100 dark:border-slate-800 min-w-[180px] transition-colors duration-300">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Dosen Pengampu</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                            <i className="fa-solid fa-user-tie text-slate-400 dark:text-slate-500"></i> 
                                                            {item.lecturer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))

                    ) : (
                        // Empty State
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <i className="fa-regular fa-calendar-xmark text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
                            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Jadwal Kosong</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-sm">Belum ada jadwal kuliah yang terdaftar.</p>
                        </div>
                    )}
                    
                </div>
            </div>
        </Layout>
    );
}