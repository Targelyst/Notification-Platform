import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";

const Area = ({
    title,
    progress,
    children,
    link,
    ressourcesText,
    borderless,
    description,
    backgroundColor,
    onClick,
    seperator,
}: {
    title?: string;
    progress?: number;
    children: ReactNode;
    link?: string;
    ressourcesText?: string;
    borderless?: boolean;
    description?: ReactNode;
    backgroundColor?: string;
    onClick?: () => void;
    seperator?: boolean;
}) => {
    const { t } = useTranslation();
    return (
        <section
            className={` 
                ${backgroundColor || "bg-impolar-bg-surface"} 
                ${
                    borderless
                        ? ""
                        : "rounded-2xl border border-impolar-bg-highlight shadow-xl p-4 md:p-6"
                }
                hover:shadow-impolar-bg/30 transition-shadow min-w-0
            `}
        >
            {title && (
                <div className="flex justify-between items-baseline mb-6 w-full">
                    <div className="space-y-2 max-w-2/3">
                        <h2 className="text-xl font-semibold text-impolar-bg-text justify-start flex items-center gap-3">
                            <span>{t(`${title}`)}</span>
                            {progress && (
                                <span className="text-xs font-medium px-2 py-1 bg-impolar-bg-highlight rounded-md text-impolar-bg-text">
                                    {progress}% {t("complete")}
                                </span>
                            )}
                        </h2>
                        {(progress || seperator) && (
                            <div
                                className={`${
                                    seperator ? "w-2/3 h-0.25" : "w-48 h-1.5"
                                } bg-impolar-bg-highlight rounded-full overflow-hidden`}
                            >
                                <div
                                    className="h-full bg-gradient-to-r from-impolar-secondary via-emerald-400 to-impolar-primary transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                        {description && (
                            <div className="text-sm text-impolar-bg-text/80 mt-2 max-w-full md:max-w-2/3">
                                {description}
                            </div>
                        )}
                    </div>
                    {ressourcesText && (
                        <button
                            type="button"
                            onClick={onClick}
                            className="flex items-center gap-1 text-impolar-bg-text/80 hover:text-impolar-bg-text text-sm transition-colors -mt-[3px] underline underline-offset-4 ml-3"
                        >
                            {t(`${ressourcesText}`)}
                            <FiArrowRight className="mt-0.5 h-5 w-5" />
                        </button>
                    )}
                </div>
            )}

            <div>
                {children}
            </div>
        </section>
    );
};

export default Area;