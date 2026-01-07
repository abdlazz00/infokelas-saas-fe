import React, { useState } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export default function Login({ onClose }) {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('login'); 
    const [loading, setLoading] = useState(false);

    // --- FORM INPUTS ---
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // --- ADMIN URL (Sesuaikan dengan URL Backend Anda) ---
    const adminUrl = "https://admin.infokelas.com/admin/login";

    // 1. LOGIC LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.login(identifier, password);
            const { token, user } = res.data; 

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success(`Selamat datang, ${user.name}!`);
            
            // Redirect Full Refresh
            window.location.href = '/dashboard'; 
        } catch (error) {
            console.error("Login Error:", error);
            const pesan = error.response?.data?.message || 'Gagal login. Periksa Email/NIM dan Password.';
            toast.error(pesan);
        } finally {
            setLoading(false);
        }
    };

    // 2. LOGIC REQUEST OTP (Kirim WA)
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.requestOtp(identifier);
            toast.success('Kode OTP terkirim ke WhatsApp! Cek HP Anda.');
            setView('reset-password'); // Pindah ke form OTP
        } catch (error) {
            console.error("OTP Error:", error);
            const pesan = error.response?.data?.message || 'Gagal mengirim OTP. Pastikan NIM/Email benar.';
            toast.error(pesan);
        } finally {
            setLoading(false);
        }
    };

    // 3. LOGIC RESET PASSWORD (Simpan Password Baru)
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.resetPassword(identifier, otp, newPassword);
            toast.success('Password berhasil diubah! Silakan login.');
            
            // Reset Form & Balik ke Login
            setPassword(''); 
            setView('login'); 
        } catch (error) {
            console.error("Reset Error:", error);
            const pesan = error.response?.data?.message || 'Kode OTP salah atau kadaluarsa.';
            toast.error(pesan);
        } finally {
            setLoading(false);
        }
    };

    // --- SETUP STYLE (MODAL vs PAGE) ---
    const isModal = !!onClose;
    const wrapperClass = isModal 
        ? "fixed inset-0 z-[60] flex items-center justify-center p-4" 
        : "min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden p-6";

    return (
        <div className={wrapperClass}>
            
            {/* Backdrop Modal */}
            {isModal && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            )}

            {/* Background Hiasan (Hanya jika bukan modal) */}
            {!isModal && (
                <>
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                </>
            )}

            {/* --- CARD UTAMA --- */}
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 relative z-10 overflow-hidden transform transition-all scale-100">
                
                {/* Tombol Close (X) */}
                {isModal && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 p-2 rounded-full z-20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}

                {/* HEADER DINAMIS */}
                <div className="pt-10 pb-6 px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
                        {/* Ganti Icon sesuai View */}
                        {view === 'login' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>}
                        {view === 'request-otp' && <i className="fa-brands fa-whatsapp text-3xl"></i>}
                        {view === 'reset-password' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
                    </div>
                    
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {view === 'login' && 'Infokelas.'}
                        {view === 'request-otp' && 'Lupa Password?'}
                        {view === 'reset-password' && 'Reset Password'}
                    </h1>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        {view === 'login' && 'Masuk menggunakan Email atau NIM'}
                        {view === 'request-otp' && 'Masukkan NIM/Email, kami akan kirim OTP ke WhatsApp Anda.'}
                        {view === 'reset-password' && 'Masukkan Kode OTP dari WhatsApp dan Password Baru.'}
                    </p>
                </div>

                {/* === VIEW 1: LOGIN === */}
                {view === 'login' && (
                    <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email / NIM</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-sans" placeholder="Contoh: 12345678" required />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-sans" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 focus:outline-none">
                                    {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> 
                                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                                </button>
                            </div>
                        </div>

                        {/* Link Lupa Password */}
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setView('request-otp')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                                Lupa Password?
                            </button>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>
                )}

                {/* === VIEW 2: REQUEST OTP === */}
                {view === 'request-otp' && (
                    <form onSubmit={handleRequestOtp} className="px-8 pb-10 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email / NIM Terdaftar</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-sans" placeholder="Masukkan NIM atau Email" required />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loading ? 'Mengirim...' : <><i className="fa-brands fa-whatsapp"></i> Kirim Kode OTP</>}
                        </button>

                        <button type="button" onClick={() => setView('login')} className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            Batal
                        </button>
                    </form>
                )}

                {/* === VIEW 3: RESET PASSWORD === */}
                {view === 'reset-password' && (
                    <form onSubmit={handleResetPassword} className="px-8 pb-10 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Kode OTP (Cek WA)</label>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-center text-lg tracking-widest font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="XXXXXX" required maxLength={6} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password Baru</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-sans" placeholder="Min. 6 Karakter" required minLength={6} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loading ? 'Menyimpan...' : 'Ubah Password'}
                        </button>
                        
                        <div className="text-center">
                             <button type="button" onClick={() => setView('request-otp')} className="text-xs text-indigo-600 hover:underline">
                                Kirim Ulang OTP
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer Section */}
                <div className="bg-slate-50 dark:bg-slate-800/50 py-4 px-8 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400">
                        © 2026 Infokelas. All rights reserved.
                    </p>
                    
                    {/* 🔥 TOMBOL ADMIN DISINI 🔥 */}
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <a 
                            href={adminUrl} 
                            className="text-[10px] font-medium text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Masuk sebagai Admin?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}