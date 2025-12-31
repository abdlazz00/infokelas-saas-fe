import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // State Form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/login', { email, password });

            const token = res.data.data.token;
            const user = res.data.data.user;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/dashboard');
        } catch (error) {
            console.error("Login Error:", error);
            const pesan = error.response?.data?.message || 'Login Gagal: Periksa email dan password.';
            alert(pesan);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden p-6">
            
            {/* --- DECORATIVE BACKGROUND (Hiasan) --- */}
            {/* Blob Biru Kiri Bawah */}
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            {/* Blob Ungu/Biru Kanan Atas */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* --- LOGIN CARD --- */}
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 relative z-10 overflow-hidden">
                
                {/* Header Section */}
                <div className="pt-10 pb-6 px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4 shadow-sm">
                        <i className="fa-solid fa-shapes text-3xl"></i>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Infokelas.
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        Masuk untuk memulai aktivitas belajar
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
                    
                    {/* Input Email */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                            Email / NIM
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
                                <i className="fa-regular fa-envelope"></i>
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="mahasiswa@univ.ac.id"
                                required
                            />
                        </div>
                    </div>

                    {/* Input Password */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Password
                            </label>
                            <a href="#" className="text-[11px] font-bold text-brand-600 hover:underline">Lupa?</a>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 font-sans"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <><i className="fa-solid fa-circle-notch fa-spin"></i> Masuk...</>
                        ) : (
                            <>Masuk Aplikasi <i className="fa-solid fa-arrow-right"></i></>
                        )}
                    </button>

                </form>

                {/* Footer Section */}
                <div className="bg-slate-50 dark:bg-slate-800/50 py-4 px-8 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400">
                        © 2025 Infokelas. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}