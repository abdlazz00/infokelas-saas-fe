import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Layout from '../components/Layout';
import Skeleton from '../components/Skeleton';
import api from '../services/api';

export default function Profile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- STATE MODAL ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [resultModal, setResultModal] = useState({
        show: false,
        type: 'success',
        message: ''
    });

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: null,
        preview: null
    });

    // =============================
    // 1️⃣ FETCH PROFILE
    // =============================
    const { data: user, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/profile');
            return res.data.data;
        },
        staleTime: Infinity
    });

    // =============================
    // 2️⃣ UPDATE PROFILE
    // =============================
    const updateMutation = useMutation({
        mutationFn: async (newData) => {
            const payload = new FormData();
            if (newData.name.trim()) payload.append('name', newData.name);
            if (newData.email.trim()) payload.append('email', newData.email);
            if (newData.avatar) payload.append('avatar', newData.avatar);

            const res = await api.post('/profile/update', payload);
            return res.data.data;
        },

        onSuccess: (updatedUser) => {
            // 🔥 REALTIME UPDATE
            queryClient.setQueryData(['profile'], (old) => ({
                ...old,
                ...updatedUser
            }));

            setShowEditModal(false);
            setResultModal({
                show: true,
                type: 'success',
                message: 'Profil berhasil diperbarui!'
            });

            setFormData({
                name: '',
                email: '',
                avatar: null,
                preview: null
            });
        },

        onError: (err) => {
            setResultModal({
                show: true,
                type: 'error',
                message: err.response?.data?.message || 'Gagal menyimpan perubahan.'
            });
        }
    });

    // =============================
    // HANDLERS
    // =============================
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            avatar: file,
            preview: URL.createObjectURL(file)
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const confirmLogout = () => {
        queryClient.clear();
        localStorage.clear();
        navigate('/');
    };

    // =============================
    // RENDER
    // =============================
    return (
        <Layout>
            {/* ================= HEADER ================= */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
                >
                    <i className="fa-solid fa-arrow-left text-slate-600 dark:text-slate-400"></i>
                </button>

                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                        Profil Saya
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Informasi & Pengaturan
                    </p>
                </div>

                <button
                    onClick={() => {
                        setFormData({
                            name: '',
                            email: '',
                            avatar: null,
                            preview: user?.avatar_url
                        });
                        setShowEditModal(true);
                    }}
                    className="text-brand-600 dark:text-brand-400 font-bold text-sm hover:underline"
                >
                    Edit
                </button>
            </header>

            {/* ================= CONTENT ================= */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                <div className="max-w-xl mx-auto">
                    {/* Kartu Profile */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border p-8 text-center mb-6">
                        {isLoading ? (
                            <Skeleton className="w-28 h-28 rounded-full mx-auto" />
                        ) : (
                            <>
                                {user?.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        className="w-28 h-28 rounded-full mx-auto object-cover"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-brand-100 mx-auto flex items-center justify-center text-4xl font-bold">
                                        {user?.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                )}

                                <h2 className="mt-4 text-2xl font-bold">
                                    {user?.name}
                                </h2>
                                <p className="text-slate-500">{user?.email}</p>
                            </>
                        )}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold"
                    >
                        Keluar Aplikasi
                    </button>
                </div>
            </div>

            {/* ================= MODALS ================= */}

            {/* EDIT MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleSave}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md"
                    >
                        <h3 className="font-bold mb-4">Edit Profil</h3>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <input
                            type="text"
                            placeholder={user?.name}
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full mt-3 p-3 border rounded"
                        />

                        <input
                            type="email"
                            placeholder={user?.email}
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full mt-3 p-3 border rounded"
                        />

                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="w-full mt-4 bg-brand-600 text-white py-3 rounded"
                        >
                            {updateMutation.isPending
                                ? 'Menyimpan...'
                                : 'Simpan'}
                        </button>
                    </form>
                </div>
            )}

            {/* RESULT MODAL */}
            {resultModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl text-center">
                        <p>{resultModal.message}</p>
                        <button
                            onClick={() =>
                                setResultModal({ ...resultModal, show: false })
                            }
                            className="mt-4 px-4 py-2 bg-slate-200 rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* LOGOUT CONFIRM */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl text-center">
                        <p>Yakin ingin keluar?</p>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 bg-slate-200 rounded"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
