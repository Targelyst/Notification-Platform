import type { ReactNode } from "react";
import { FiFile } from "react-icons/fi";

const BasicLayout = ({
    title,
    description,
    children,
    toolbar,
    icon,
}: {
    title?: ReactNode;
    children: ReactNode;
    description?: ReactNode;
    toolbar?: ReactNode;
    icon?: ReactNode;
}) => {
    return (
        <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-12 mt-6 mb-12">
            <div className="flex justify-between items-center flex-wrap gap-4 p-1">
                <div className="flex gap-3 items-center">
                    <div className="font-bold text-xl md:text-2xl p-2  text-impolar-primary bg-gradient-to-r from-emerald-400 to-impolar-secondary rounded-xl">
                        {icon ?? <FiFile className="p-1" />}
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-impolar-bg-text">
                            {title}
                        </h1>
                        {description && (
                            <div className="text-impolar-bg-text/80 mt-1 text-sm md:text-base max-w-2xl">
                                {description}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {toolbar}
                </div>
            </div>

            {children}
        </div>
    )
};

export default BasicLayout;