import {
	FiHome,
	FiActivity,
	FiEdit,
	FiFile,
	FiInbox,
	FiLayout,
	FiRepeat,
	FiSend,
	FiTag,
	FiUsers,
	FiUser,
} from "react-icons/fi";
import type { ReactNode } from "react";
import { Home } from "./pages/home/Home";
import { UserPage } from "./pages/user/UserPage";
import Segments from "./pages/audience/segments";

export interface RouteConfig {
	path: string;
	nameKey: string;
	icon: ReactNode;
	component?: ReactNode;
	children?: RouteConfig[];
}

const AnalyticsComponent = () => (
	<div>
		Analytics
	</div>
);

export const routes: RouteConfig[] = [
	{
		path: "/home",
		nameKey: "home",
		icon: <FiHome className="w-5 h-5" />,
		component: <Home />,
	},
	{
		path: "/analytics",
		nameKey: "analytics",
		icon: <FiActivity className="w-5 h-5" />,
		component: <AnalyticsComponent />,
	},
	{
		path: "/content",
		nameKey: "content",
		icon: <FiFile className="w-5 h-5" />,
		children: [
			{
				path: "/content/templates",
				nameKey: "templates",
				icon: <FiLayout className="w-4 h-4" />,
				component: <div>Templates</div>,
			},
			{
				path: "/content/signup-form",
				nameKey: "signup_form",
				icon: <FiEdit className="w-4 h-4" />,
				component: <div>Signup Form</div>,
			},
		],
	},
	{
		path: "/audience",
		nameKey: "audience",
		icon: <FiUsers className="w-5 h-5" />,
		children: [
			{
				path: "/audience/contacts",
				nameKey: "contacts",
				icon: <FiUsers className="w-4 h-4" />,
				component: <div>Contacts</div>,
			},
			{
				path: "/audience/inbox",
				nameKey: "inbox",
				icon: <FiInbox className="w-4 h-4" />,
				component: <div>Inbox</div>,
			},
			{
				path: "/audience/segments",
				nameKey: "segments",
				icon: <FiTag className="w-4 h-4" />,
				component: <Segments />,
			},
		],
	},
	{
		path: "/campaigns",
		nameKey: "campaigns",
		icon: <FiSend className="w-5 h-5" />,
		component: <div>Campaigns</div>,
	},
	{
		path: "/automations",
		nameKey: "automations",
		icon: <FiRepeat className="w-5 h-5" />,
		children: [
			{
				path: "/automations/overview",
				nameKey: "overview",
				icon: <FiActivity className="w-4 h-4" />,
				component: <div>Overview</div>,
			},
			{
				path: "/automations/email-journeys",
				nameKey: "email_journeys",
				icon: <FiRepeat className="w-4 h-4" />,
				component: <div>All Journeys</div>,
			},
		],
	},
	{
		path: "/user",
		nameKey: "user",
		icon: <FiUser className="w-5 h-5" />,
		component: <UserPage />,
	},
];

