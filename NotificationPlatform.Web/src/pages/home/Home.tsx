import { FiExternalLink, FiUserPlus, FiMail, FiFileText, FiMap, FiClipboard, FiSettings } from "react-icons/fi";
import Area from "../../components/Area";
import Card from "../../components/Card";
import BasicLayout from "../../components/BasicLayot";


export const Home = () => {
  const sections = [
    {
      title: "Get Started",
      progress: 40,
      link: "/getting-started",
      ressourcesText: "view_all_ressources",
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
      link: "/content",
      ressourcesText: "view_all_ressources",
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
    <BasicLayout title="Welcome back, maaaaaaaa" description="Here's what's happening in your workspace" toolbar={<button type="button" className="flex items-center gap-2 bg-impolar-bg-surface hover:bg-impolar-bg-highlight border border-impolar-bg-highlight px-4 py-2.5 rounded-lg transition-all shrink-0" > <FiSettings className="text-impolar-bg-text" /> <span className="text-impolar-bg-text text-sm"> Workspace Settings </span> </button>}>


      {sections.map((section, sectionIdx) => (
        <Area

          onClick={() => console.log("Clicked")}
          key={sectionIdx}
          title={section.title}
          progress={section.progress}
          link={section.link}
          ressourcesText={section.ressourcesText}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {section.cards.map((card, cardIdx) => (
              <Card
                key={cardIdx}
                title={card.title}
                desc={card.desc}
                icon={card.icon}
                status={card.status}
                stats={card.stats}
                hoverText={card.hoverText}
                link={card.link}
              />
            ))}
          </div>
        </Area>

      ))}

    </BasicLayout>
  );
};

export default Home;