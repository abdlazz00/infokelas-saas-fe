import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query
import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton';
import api from '../services/api';

export default function Profile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // --- STATE MODAL ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // <--- State untuk Popup Logout
    const [resultModal, setResultModal] = useState({ show: false, type: 'success', message: '' });
    
    // State Form
    const [formData, setFormData] = useState({ name: '', email: '', avatar: null, preview: null });

    // 1. Fetch Profile Data
    const { data: user, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/profile');
            return res.data.data;
        },
        staleTime: 60000, 
    });

    // 2. Mutation Update Profile
    const updateMutation = useMutation({
        mutationFn: async (newData) => {
            const payload = new FormData();
            if (newData.name.trim()) payload.append('name', newData.name);
            if (newData.email.trim()) payload.append('email', newData.email);
            if (newData.avatar) payload.append('avatar', newData.avatar);

            return await api.post('/profile/update', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: (response) => {
            const updatedUser = response.data.data;

            // Update Cache & LocalStorage
            queryClient.setQueryData(['profile'], (oldData) => ({ ...oldData, ...updatedUser }));
            const storedUser = JSON.parse(localStorage.getItem('user')) || {};
            const mergedUser = { ...storedUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(mergedUser));

            // Tutup Modal & Reset
            setShowEditModal(false);
            setResultModal({ show: true, type: 'success', message: 'Profil berhasil diperbarui!' });
            setFormData({ name: '', email: '', avatar: null, preview: null });
            
            queryClient.invalidateQueries(['profile']);
        },
        onError: (err) => {
            setResultModal({
                show: true,
                type: 'error',
                message: err.response?.data?.message || 'Gagal menyimpan perubahan.'
            });
        }
    });

    // Helper Handlers
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFormData({ ...formData, avatar: file, preview: URL.createObjectURL(file) });
    };
    
    const handleSave = (e) => { e.preventDefault(); updateMutation.mutate(formData); };
    
    // --- LOGIC LOGOUT BARU ---
    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Buka modal konfirmasi
    };

    const confirmLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <Layout>
            {/* Header Page */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 transition-colors duration-300">
                <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition">
                    <i className="fa-solid fa-arrow-left text-slate-600 dark:text-slate-400"></i>
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Profil Saya</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Informasi & Pengaturan</p>
                </div>
                <button 
                    onClick={() => {
                        setFormData({ name: '', email: '', avatar: null, preview: user?.avatar_url });
                        setShowEditModal(true);
                    }}
                    className="text-brand-600 dark:text-brand-400 font-bold text-sm hover:underline"
                >
                    Edit
                </button>
            </header>

            {/* Content Page */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                <div className="max-w-xl mx-auto page-enter">
                    
                    {/* KARTU PROFIL UTAMA */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-8 text-center shadow-sm relative overflow-hidden mb-6 group">
                        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-r from-brand-600 to-indigo-600"></div>
                        
                        <div className="relative z-10 -mt-2">
                            {isLoading ? (
                                <Skeleton className="w-28 h-28 rounded-full mx-auto border-4 border-white dark:border-slate-900" />
                            ) : (
                                <div className="relative inline-block">
                                    <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-900 mx-auto p-1.5 shadow-lg overflow-hidden">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full bg-slate-200" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center text-4xl font-bold">
                                                {user?.name?.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setFormData({ name: '', email: '', avatar: null, preview: user?.avatar_url });
                                            setShowEditModal(true);
                                        }}
                                        className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-slate-800 text-slate-600 dark:text-white rounded-full shadow-md border border-gray-100 dark:border-slate-700 flex items-center justify-center hover:text-brand-600 transition"
                                    >
                                        <i className="fa-solid fa-pen text-xs"></i>
                                    </button>
                                </div>
                            )}

                            <div className="mt-4 space-y-1">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-6 w-48 mx-auto rounded-lg" />
                                        <Skeleton className="h-4 w-32 mx-auto rounded-lg" />
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DETAIL INFORMASI AKADEMIK */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
                            <i className="fa-solid fa-graduation-cap text-brand-600 dark:text-brand-400"></i> Data Akademik
                        </h3>
                        
                        <div className="space-y-5">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0">Universitas</span>
                                {isLoading ? <Skeleton className="h-4 w-40 rounded" /> : (
                                    <span className="text-sm font-bold text-slate-800 dark:text-white text-right max-w-[60%] leading-tight">
                                        {user?.university || '-'}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Program Studi</span>
                                {isLoading ? <Skeleton className="h-4 w-32 rounded" /> : (
                                    <span className="text-sm font-bold text-slate-800 dark:text-white text-right">
                                        {user?.major || '-'}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-slate-400">NIM</span>
                                {isLoading ? <Skeleton className="h-4 w-24 rounded" /> : (
                                    <span className="text-sm font-bold text-slate-800 dark:text-white text-right font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                        {user?.nim || '-'}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Semester</span>
                                {isLoading ? <Skeleton className="h-4 w-8 rounded" /> : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                        {user?.semester || '-'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TOMBOL LOGOUT */}
                    <button 
                        onClick={handleLogoutClick} // <-- Panggil Modal Custom
                        className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/20"
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Keluar Aplikasi
                    </button>

                    <div className="text-center mt-8 text-xs text-slate-300 dark:text-slate-600 font-mono">
                        Infokelas App v1.0.0
                    </div>
                </div>
            </div>

            {/* --- MODAL EDIT PROFILE --- */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative border border-gray-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        
                        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profil</h3>
                            <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition flex items-center justify-center">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3 ring-4 ring-white dark:ring-slate-800 shadow-md relative group cursor-pointer">
                                    {formData.preview ? (
                                        <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-300 dark:text-slate-600">
                                            {user?.name?.substring(0,2).toUpperCase()}
                                        </div>
                                    )}
                                    <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer text-white">
                                        <i className="fa-solid fa-camera text-xl"></i>
                                    </label>
                                </div>
                                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                <label htmlFor="avatar-upload" className="text-xs font-bold text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
                                    Ubah Foto
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 ml-1">Nama Lengkap (Opsional)</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition placeholder:text-slate-400"
                                    placeholder={user?.name}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 ml-1">Email Address (Opsional)</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition placeholder:text-slate-400"
                                    placeholder={user?.email}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={updateMutation.isPending}
                                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/20 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {updateMutation.isPending ? (
                                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Menyimpan...</>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL RESULT SUKSES/GAGAL --- */}
            {resultModal.show && (
                <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl relative border border-gray-100 dark:border-slate-800 p-6 text-center">
                        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${resultModal.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            <i className={`fa-solid ${resultModal.type === 'success' ? 'fa-check text-3xl' : 'fa-triangle-exclamation text-2xl'}`}></i>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{resultModal.type === 'success' ? 'Berhasil!' : 'Ups, Gagal!'}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 break-words">{resultModal.message}</p>
                        <button onClick={() => setResultModal({ ...resultModal, show: false })} className="w-full py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition">
                            {resultModal.type === 'success' ? 'Oke, Mengerti' : 'Coba Lagi'}
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL CONFIRM LOGOUT (BARU) --- */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 page-enter">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl relative border border-gray-100 dark:border-slate-800 p-6 text-center">
                        {/* Icon Logout Besar */}
                        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            <i className="fa-solid fa-arrow-right-from-bracket text-2xl"></i>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Konfirmasi Keluar</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Apakah Anda yakin ingin keluar dari aplikasi?
                        </p>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmLogout}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/20 transition"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
}