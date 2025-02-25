import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";

const Area = ({
    title,
    progress,
    children,
    link,
    ressourcesText,
    onClick
}: {
    title?: string;
    progress?: number;
    children: ReactNode;
    link?: string;
    ressourcesText?: string;
    onClick?: () => void;
}) => {
    const { t } = useTranslation();
    return (
        <section className="bg-impolar-bg-surface rounded-2xl border border-impolar-bg-highlight p-4 md:p-6 shadow-xl hover:shadow-impolar-bg/30 transition-shadow min-w-0">
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-impolar-bg-text flex items-center gap-3">
                        {t(`${title}`)}
                        {progress && <span className="text-xs font-medium px-2 py-1 bg-impolar-bg-highlight rounded-md text-impolar-bg-text">
                            {progress}% {t('complete')}
                        </span>}
                    </h2>
                    {progress && <div className="w-48 h-1.5 bg-impolar-bg-highlight rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>}
                </div>
                {link && <button
                    type="button"
                    onClick={onClick}
                    className="flex items-center gap-1 text-impolar-bg-text/80 hover:text-impolar-bg-text text-sm transition-colors ml-3"
                >
                    {t(`${ressourcesText}`)}
                    <FiArrowRight className="mt-0.5" />
                </button>}
            </div>

                {children}
        </section>
    );
};

export default Area;