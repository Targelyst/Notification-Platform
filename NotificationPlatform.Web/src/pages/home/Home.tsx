import { FiExternalLink, FiUserPlus, FiMail, FiFileText, FiMap, FiClipboard, FiSettings } from "react-icons/fi";
import Area from "../../components/Area";
import Card from "../../components/Card";


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
    <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4 p-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-impolar-bg-text">
            Welcome back, maaaaaaaa
          </h1>
          <p className="text-impolar-bg-text/80 mt-1 text-sm md:text-base">
            Last login: 2 hours ago
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 bg-impolar-bg-surface hover:bg-impolar-bg-highlight border border-impolar-bg-highlight px-4 py-2.5 rounded-lg transition-all shrink-0"
          >
            <FiSettings className="text-impolar-bg-text" />
            <span className="text-impolar-bg-text text-sm">
              Workspace Settings
            </span>
          </button>
        </div>

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

export default Home;