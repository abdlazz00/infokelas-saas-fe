import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';

export default function LandingPage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const phoneNumber = "6282155269479"; 
    const message = encodeURIComponent("Halo, aku ingin daftar gituloah pokoknya");
    const waLink = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white">
            
            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center gap-2 rtl:space-x-reverse">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <span className="self-center text-xl font-bold whitespace-nowrap text-slate-900 dark:text-white">Infokelas</span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button 
                            type="button" 
                            onClick={() => setIsLoginOpen(true)}
                            className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition-all shadow-lg shadow-indigo-500/30"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 border border-indigo-100 dark:border-indigo-800">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Sistem Manajemen Akademik Terintegrasi
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                        Kelola Jadwal & Materi <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Lebih Mudah & Cepat.</span>
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10">
                        Platform akademik all-in-one untuk mahasiswa modern. Akses jadwal kuliah, materi, tugas, dan pengumuman dosen dalam satu genggaman.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a 
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <i className="fa-brands fa-whatsapp text-lg"></i> Daftar Sekarang
                        </a>

                        <a href="#features" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            Pelajari Fitur
                        </a>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-regular fa-calendar-check"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Jadwal Otomatis</h3>
                            <p className="text-slate-500 dark:text-slate-400">Pantau jadwal kuliah harian Anda secara real-time. Tidak ada lagi alasan lupa masuk kelas.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-book-open"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Materi & Tugas</h3>
                            <p className="text-slate-500 dark:text-slate-400">Unduh materi kuliah dan kumpulkan tugas langsung dari platform dengan mudah.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-brands fa-whatsapp"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Notifikasi WA</h3>
                            <p className="text-slate-500 dark:text-slate-400">Dapatkan pengingat jadwal dan info kelas penting langsung ke WhatsApp Anda.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-8 text-center text-slate-500 dark:text-slate-500 text-sm border-t border-slate-100 dark:border-slate-800">
                <p>© 2026 Infokelas SaaS. Built with ❤️ for Students.</p>
            </footer>

            {/* 🔥 POPUP LOGIN 🔥 */}
            {isLoginOpen && (
                <Login onClose={() => setIsLoginOpen(false)} />
            )}

        </div>
    );
}