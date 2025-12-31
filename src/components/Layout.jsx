import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
    return (
        // Tambahkan dark:bg-slate-950 di container utama
        <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            
            <Sidebar />

            {/* Update main: dark:bg-slate-950 */}
            <main className="flex-1 flex flex-col h-full relative w-full md:pl-72 bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
                {children}
            </main>

            <BottomNav />
        </div>
    );
}