import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnnouncementSlider({ data = [] }) {
    const navigate = useNavigate();
    
    // State untuk Popup Detail
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    // Jika data kosong, hidden
    if (!data || data.length === 0) return null;

    // --- HELPER WARNA ---
    const getTypeColor = (type) => {
        switch (type) {
            case 'danger': return 'bg-red-500';
            case 'warning': return 'bg-amber-500';
            default: return 'bg-blue-500';
        }
    };

    const getBadgeStyle = (type) => {
        switch (type) {
            case 'danger': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
            default: return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
        }
    };

    return (
        <div className="mb-6">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-3 px-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                    Pengumuman
                </h3>
                <button 
                    onClick={() => navigate('/announcements')} 
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                    Lihat Semua
                </button>
            </div>

            {/* --- SLIDER CARD (MINIMALIS) --- */}
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x scrollbar-hide">
                {data.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedAnnouncement(item)} // Buka Popup
                        className="snap-center shrink-0 w-60 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 relative overflow-hidden group hover:border-brand-300 dark:hover:border-brand-700 transition cursor-pointer flex flex-col justify-between h-32"
                    >
                        {/* Garis Warna Kiri */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${getTypeColor(item.type)}`}></div>

                        <div className="pl-2">
                            {/* Baris 1: Tag & Tanggal */}
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getBadgeStyle(item.type)}`}>
                                    {/* LOGIKA LABEL (CARD) */}
                                    {item.type === 'info' ? 'Informasi' : item.type === 'warning' ? 'Penting' : 'Darurat'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {item.date}
                                </span>
                            </div>

                            {/* Baris 2: Judul */}
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-snug line-clamp-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                {item.title}
                            </h4>
                        </div>
                        
                        {/* Hint "Klik untuk detail" */}
                        <div className="pl-2 mt-auto">
                             <p className="text-[10px] text-slate-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Selengkapnya <i className="fa-solid fa-arrow-right"></i>
                             </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- POPUP MODAL --- */}
            {selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedAnnouncement(null)}>
                    <div 
                        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100 dark:border-slate-700 animate-slide-up"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        {/* Tombol Close */}
                        <button 
                            onClick={() => setSelectedAnnouncement(null)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 text-slate-600 dark:text-white flex items-center justify-center transition z-10"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        {/* Scrollable Content */}
                        <div className="max-h-[80vh] overflow-y-auto">
                            {/* Gambar Banner (Jika Ada) */}
                            {selectedAnnouncement.image_url && (
                                <img 
                                    src={selectedAnnouncement.image_url} 
                                    alt="Banner" 
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            <div className="p-6">
                                {/* Header Modal */}
                                <div className="flex gap-3 items-center mb-3">
                                    {/* PERBAIKAN DI SINI: Menggunakan Logika Bahasa Indonesia */}
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getBadgeStyle(selectedAnnouncement.type)}`}>
                                        {selectedAnnouncement.type === 'info' ? 'Informasi' : 
                                         selectedAnnouncement.type === 'warning' ? 'Penting' : 'Darurat'}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {selectedAnnouncement.date}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                    {selectedAnnouncement.title}
                                </h2>

                                <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                                    {selectedAnnouncement.content}
                                </div>

                                {/* Footer Modal */}
                                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                                        <i className="fa-solid fa-user-shield"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">Posted by</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedAnnouncement.author}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}