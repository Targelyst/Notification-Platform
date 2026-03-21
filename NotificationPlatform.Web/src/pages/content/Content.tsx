import React from "react";
import BasicLayout from "../../components/BasicLayot";
import Area from "../../components/Area";
import Datagrid from "../../components/Datagrid";
import Button from "../../components/Button";
import { FiClipboard, FiFileText, FiMap, FiSettings } from "react-icons/fi";
import Card from "../../components/Card";

export const Content = () => {

    const cards = [
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
        },]
    return (
        <div>
            <BasicLayout title="Content Hub" description="Create your content once, use it everywhere"
                toolbar={<button type="button" className="flex items-center gap-2 bg-impolar-bg-surface hover:bg-impolar-bg-highlight border border-impolar-bg-highlight px-4 py-2.5 rounded-lg transition-all shrink-0" > <FiSettings className="text-impolar-bg-text" /> <span className="text-impolar-bg-text text-sm"> Guide </span> </button>}
            >
                {/* <div className='   bg-gradient-to-r from-impolar-bg-highligh  via-impolar-bg-highlight to-impolar-bg-surface'> */}
                <div className="relative">
                    {/* Backlayer shadow element */}
                    <div className="absolute inset-0  -bottom-3 left-4 right-4 bg-gradient-to-br from-white/10 to-transparent rounded-xl shadow-[0_15px_30px_-15px_rgba(255,255,255,0.1)] backdrop-blur-sm" />

                    <Area
                        backgroundColor="relative shadow-[0_10px_20px_rgba(0,0,0,0.15)] drop-shadow-[0_10px_8px_rgba(255,255,255,0.12)] bg-impolar-bg rounded-xl pt-12 px-6 md:px-12 pb-2 border border-impolar-bg-highlight backdrop-blur-3xl"
                        seperator
                        borderless
                        title="Powerful tools to create content that works"
                        description={
                            <p>
                                Our template creator lets you create{" "}
                                <strong>powerful templates </strong> and sign-up{" "}
                                <strong>forms</strong> to broadcast to{" "}
                                <strong>your audiance</strong>. Templates can be used to create
                                powerful campaigns targeting your audiance based on segments and
                                sign up forms.
                            </p>
                        }
                    >
                        <div className="w-24 h-8 ">a</div>
                        <div className="w-full bg-impolar-bg-surface px-2 md:px-8 rounded-2xl mb-12 border border-impolar-bg-highlight">
                            <Area title="Tools" progress={35} link="/content" ressourcesText="View all tools" borderless backgroundColor=" pt-4 pb-4" >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left mt-10">
                                    {cards.map((card, cardIdx) => (
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
                        </div>
                    </Area>
                </div>
                

            </BasicLayout>
            <div className="p-4 mx-auto m-auto md:p-12 bg-impolar-bg-surface/60 ">
                <Area
                    borderless
                    title="Need help getting started?"
                    backgroundColor="p-4  rounded-2xl"
                    ressourcesText="View more ressources"
                    description="Here you can create powerful templates to broadcast to your audiance"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left mt-10">
                        {cards.map((card, cardIdx) => (
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
            </div>
        </div>
    );
};

export default Content;