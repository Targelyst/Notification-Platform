import { FiArrowRight } from "react-icons/fi";

const Area = ({
  title,
  progress,
  children,
  link = "#"
}: {
  title?: string;
  progress?: number;
  children: React.ReactNode;
  link?: string;
}) => {
  return (
    <section className="bg-impolar-bg-surface rounded-2xl border border-impolar-bg-highlight p-4 md:p-6 shadow-xl hover:shadow-impolar-bg/30 transition-shadow min-w-0">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-impolar-bg-text flex items-center gap-3">
            {title}
            {progress &&<span className="text-xs font-medium hidden md:block px-2 py-1 bg-impolar-bg-highlight rounded-md text-impolar-bg-text">
              {progress}% Complete
            </span>}
          </h2>
          <div className="w-48 h-1.5 bg-impolar-bg-highlight rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <a
          href={link}
          className="flex items-center gap-1 text-impolar-bg-text/80 hover:text-impolar-bg-text text-sm transition-colors ml-3"
        >
          View all resources
          <FiArrowRight className="mt-0.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {children}
      </div>
    </section>
  );
};

export default Area;