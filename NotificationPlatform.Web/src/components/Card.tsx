import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import StatusBadge from "./StatusBadge";

const Card = ({
  title,
  desc,
  icon,
  status,
  stats,
  hoverText,
  link
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  status: string;
  progress?: number;
  stats: string;
  hoverText: string;
  link: string;
}) => {
  return (
    <a
      href={link}
      className="relative bg-gradient-to-br from-impolar-bg-highlight to-impolar-bg rounded-xl p-5 border border-impolar-bg-highlight hover:border-impolar-bg-text transition-all duration-300 hover:shadow-impolar-bg/20"
    >
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={status} />
        {status === "completed" && (
          <FiCheckCircle className="w-5 h-5 text-emerald-400/80" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-impolar-bg-highlight rounded-lg shadow-sm">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-impolar-bg-text line-clamp-2">
            {title}
          </h3>
        </div>
        <p className="text-impolar-bg-text/80 text-sm leading-relaxed line-clamp-3">
          {desc}
        </p>
        <div className="text-xs font-medium text-impolar-bg-text/60">
          {stats}
        </div>
      </div>


      <div className="absolute inset-0 bg-impolar-bg/90 opacity-0 rounded-2xl group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-3 p-4 text-center">
        <span className="text-impolar-bg-text font-medium text-sm">
          {hoverText}
        </span>
        <div className="flex items-center gap-1.5 text-impolar-bg-text/80 group-hover:text-impolar-bg-text transition-colors">
          <span className="text-xs">Quick action</span>
          <FiArrowRight className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
};

export default Card;