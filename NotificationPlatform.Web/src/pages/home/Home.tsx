import { FiExternalLink, FiUserPlus, FiMail, FiFileText, FiMap, FiClipboard, FiCheckCircle, FiArrowRight, FiSettings } from "react-icons/fi";

const Card = ({
  title,
  desc,
  icon,
  status,
  progress,
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
      className="group relative bg-gradient-to-br from-[var(--color-impolar-bg-highlight)] to-[var(--color-impolar-bg)] rounded-xl p-5 border border-[var(--color-impolar-bg-highlight)] hover:border-[var(--color-impolar-bg-text)] transition-all duration-300 hover:shadow-[var(--color-impolar-bg)]/20"
    >
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={status} />
        {status === "completed" && (
          <FiCheckCircle className="w-5 h-5 text-emerald-400/80" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[var(--color-impolar-bg-highlight)] rounded-lg shadow-sm">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-[var(--color-impolar-bg-text)] line-clamp-2">
            {title}
          </h3>
        </div>
        <p className="text-[var(--color-impolar-bg-text)]/80 text-sm leading-relaxed line-clamp-3">
          {desc}
        </p>
        <div className="text-xs font-medium text-[var(--color-impolar-bg-text)]/60">
          {stats}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5 text-[var(--color-impolar-bg-text)]/60">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--color-impolar-bg-highlight)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[var(--color-impolar-bg)]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-3 p-4 text-center">
        <span className="text-[var(--color-impolar-bg-text)] font-medium text-sm">
          {hoverText}
        </span>
        <div className="flex items-center gap-1.5 text-[var(--color-impolar-bg-text)]/80 group-hover:text-[var(--color-impolar-bg-text)] transition-colors">
          <span className="text-xs">Quick action</span>
          <FiArrowRight className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
};

const Area = ({
  title,
  progress,
  children,
  link = "#"
}: {
  title: string;
  progress: number;
  children: React.ReactNode;
  link?: string;
}) => {
  return (
    <section className="bg-[var(--color-impolar-bg-surface)] rounded-2xl border border-[var(--color-impolar-bg-highlight)] p-6 shadow-xl hover:shadow-[var(--color-impolar-bg)]/30 transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[var(--color-impolar-bg-text)] flex items-center gap-3">
            {title}
            <span className="text-xs font-medium px-2 py-1 bg-[var(--color-impolar-bg-highlight)] rounded-md text-[var(--color-impolar-bg-text)]">
              {progress}% Complete
            </span>
          </h2>
          <div className="w-48 h-1.5 bg-[var(--color-impolar-bg-highlight)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <a
          href={link}
          className="flex items-center gap-1 text-[var(--color-impolar-bg-text)]/80 hover:text-[var(--color-impolar-bg-text)] text-sm transition-colors"
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

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: { [key: string]: { color: string; text: string } } = {
    completed: { color: "bg-emerald-500/20", text: "text-emerald-400" },
    "in-progress": { color: "bg-amber-500/20", text: "text-amber-400" },
    "attention-needed": { color: "bg-rose-500/20", text: "text-rose-400" },
    new: { color: "bg-purple-500/20", text: "text-purple-400" },
    updated: { color: "bg-sky-500/20", text: "text-sky-400" },
    recommended: { color: "bg-cyan-500/20", text: "text-cyan-400" },
  };

  return (
    <div
      className={`px-2 py-1 rounded-md ${statusConfig[status].color} ${statusConfig[status].text} text-xs font-medium capitalize`}
    >
      {status.replace("-", " ")}
    </div>
  );
};

// Updated Home Component
export const Home = () => {
  const sections = [
    {
      title: "Get Started",
      progress: 40,
      cards: [
        {
          title: "Explore Impolar Platform",
          desc: "Discover features and integration guides",
          icon: <FiExternalLink className="w-5 h-5 text-emerald-400" />,
          hoverText: "Visit documentation",
          status: "completed",
          link: "https://impolar.com/docs",
          stats: "12 new updates available",
        },
        {
          title: "Contacts Management",
          desc: "Sync your audience across platforms",
          icon: <FiUserPlus className="w-5 h-5 text-amber-400" />,
          hoverText: "Begin import",
          status: "in-progress",
          progress: 65,
          link: "/contacts",
          stats: "1,234 contacts imported",
        },
        {
          title: "Email Configuration",
          desc: "Authenticate domains and DKIM setup",
          icon: <FiMail className="w-5 h-5 text-sky-400" />,
          hoverText: "Start setup",
          status: "attention-needed",
          link: "/settings/email",
          stats: "2 domains pending verification",
        },
      ],
    },
    {
      title: "Content Creation",
      progress: 75,
      cards: [
        {
          title: "Template Designer",
          desc: "Build responsive email layouts",
          icon: <FiFileText className="w-5 h-5 text-purple-400" />,
          hoverText: "Start designing",
          status: "new",
          link: "/templates",
          stats: "3 drafts in progress",
        },
        {
          title: "Journey Builder",
          desc: "Automate customer workflows",
          icon: <FiMap className="w-5 h-5 text-rose-400" />,
          hoverText: "Create journey",
          status: "updated",
          link: "/automation",
          stats: "Last modified 2 days ago",
        },
        {
          title: "Form Generator",
          desc: "Create embeddable lead capture forms",
          icon: <FiClipboard className="w-5 h-5 text-cyan-400" />,
          hoverText: "Build form",
          status: "new",
          link: "/forms",
          stats: "15,342 submissions this month",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-impolar-bg-text)]">
            Welcome back, maaaaaaaa
          </h1>
          <p className="text-[var(--color-impolar-bg-text)]/80 mt-1 text-sm md:text-base">
            Last login: 2 hours ago
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-[var(--color-impolar-bg-surface)] hover:bg-[var(--color-impolar-bg-highlight)] border border-[var(--color-impolar-bg-highlight)] px-4 py-2.5 rounded-lg transition-all shrink-0"
        >
          <FiSettings className="text-[var(--color-impolar-bg-text)]" />
          <span className="text-[var(--color-impolar-bg-text)] text-sm">
            Workspace Settings
          </span>
        </button>
      </div>

      {sections.map((section, sectionIdx) => (
        <Area
          key={sectionIdx}
          title={section.title}
          progress={section.progress}
        >
          {section.cards.map((card, cardIdx) => (
            <Card
              key={cardIdx}
              title={card.title}
              desc={card.desc}
              icon={card.icon}
              status={card.status}
              progress={card.progress}
              stats={card.stats}
              hoverText={card.hoverText}
              link={card.link}
            />
          ))}
        </Area>
      ))}
    </div>
  );
};