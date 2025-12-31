import { useEffect, useState } from "react";

export default function useTheme() {
    // Cek localStorage, kalau kosong pakai 'light'
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Hapus class lama, tambah class baru
        root.classList.remove(theme === "dark" ? "light" : "dark");
        root.classList.add(theme);

        // Simpan ke localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Fungsi toggle
    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return { theme, toggleTheme };
}