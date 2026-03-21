import { FiX } from "react-icons/fi";

interface RightSidebarProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    width?: number;
}

export const RightSidebar = ({ 
    title, 
    onClose, 
    children, 
    className = "", 
    width = 600 
}: RightSidebarProps) => {
    return (
        <div 
            className={`absolute right-0 top-0 h-full bg-white shadow-xl overflow-y-auto ${className}`}
            style={{ width: `${width}px` }}
        >
            <div className="flex justify-between items-center mb-4 p-6">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button 
                    onClick={onClose} 
                    className="text-impolar-bg-text/60 hover:text-impolar-bg-text"
                >
                    <FiX className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6 pt-0">
                {children}
            </div>
        </div>
    );
};