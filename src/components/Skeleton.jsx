export default function Skeleton({ className = "", ...props }) {
    return (
        <div 
            className={`animate-pulse bg-gray-200 dark:bg-slate-700 rounded-xl ${className}`} 
            {...props}
        />
    );
}