import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

export default function AssignmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // Kita panggil API detail yang sudah dibuat
                const res = await api.get(`/assignments/${id}`);
                setTask(res.data.data.assignment);
            } catch (error) {
                console.error("Gagal load tugas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <Layout><div className="p-10 text-center">Loading Detail Tugas...</div></Layout>;
    if (!task) return (
        <Layout>
            <div className="p-10 text-center">
                <h3 className="text-lg font-bold text-red-500">Gagal memuat tugas</h3>
                <p className="text-slate-500 mb-4">Mungkin tugas sudah dihapus atau API belum siap.</p>
                <button onClick={() => navigate(-1)} className="text-brand-600 font-bold hover:underline">Kembali</button>
            </div>
        </Layout>
    );

    // Hitung status deadline simpel
    const deadlineDate = new Date(task.deadline);
    const isOverdue = new Date() > deadlineDate;

    return (
        <Layout>
            {/* Header dengan Tombol Kembali */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
                    <i className="fa-solid fa-arrow-left text-slate-600"></i>
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Detail Tugas</h1>
                    <p className="text-xs text-slate-500">Monitoring tugas aktif</p>
                </div>
            </div>

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto">
                    
                    {/* KARTU INFORMASI TUGAS */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        
                        {/* Bagian Judul & Status */}
                        <div className="p-6 border-b border-gray-100 bg-slate-50/50">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{task.title}</h2>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${isOverdue ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {isOverdue ? 'Deadline Lewat' : 'Sedang Aktif'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Kotak Tanggal Deadline */}
                                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm min-w-[200px]">
                                    <div className="bg-red-50 text-red-500 w-10 h-10 rounded-lg flex items-center justify-center text-lg">
                                        <i className="fa-regular fa-calendar-xmark"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Batas Waktu</p>
                                        <p className="text-sm font-bold text-slate-800">
                                            {deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Pukul {deadlineDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bagian Deskripsi / Instruksi */}
                        <div className="p-6 md:p-8">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-align-left text-brand-600"></i> Instruksi Pengerjaan
                            </h3>
                            
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100" 
                                dangerouslySetInnerHTML={{ __html: task.description || '<p class="italic text-slate-400">Tidak ada deskripsi tambahan.</p>' }}>
                            </div>

                            <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm">
                                <i className="fa-solid fa-circle-info mt-0.5 text-blue-500"></i>
                                <div>
                                    <span className="font-bold block mb-1">Info Pengumpulan:</span>
                                    Tugas ini bersifat monitoring. Silakan kerjakan sesuai instruksi dan kumpulkan melalui metode yang disepakati di kelas (Email/Hardcopy/LMS Kampus Lain).
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}