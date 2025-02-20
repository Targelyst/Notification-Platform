import { ReactNode } from "react";


const BasicLayout = ({
    title,
    description,
    children,
    toolbar,
}: {
    title?: string;
    children: ReactNode;
    description?: string;
    toolbar?: ReactNode;
}) => {


    return (
        <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-12">
            <div className="flex justify-between items-center flex-wrap gap-4 p-1">
                <span>
                    <h1 className="text-2xl md:text-3xl font-bold text-impolar-bg-text">
                        {title}
                    </h1>
                    <p className="text-impolar-bg-text/80 mt-1 text-sm md:text-base max-w-2xl">
                        {description}
                    </p>
                </span>
                <div className="flex gap-2">
                    {toolbar}
                </div>

            </div>

            {children}
        </div>
    )
};

export default BasicLayout;