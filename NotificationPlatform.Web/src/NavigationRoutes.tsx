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

import {TbHomeFilled, TbBrandGoogleAnalytics } from "react-icons/tb";
import { } from "react-icons/io";
import type { ReactNode } from "react";

import { RoutesAndUrls } from "./RoutesAndUrls"; 

export interface NavigationRouteConfig {
	path: string;
	nameKey: string;
	icon: ReactNode;
	children?: NavigationRouteConfig[];
}

export const NavigationRoutes: NavigationRouteConfig[] = [
    {
        path: RoutesAndUrls.HOME.urlPath,
        nameKey: RoutesAndUrls.HOME.pageName,
        icon: <TbHomeFilled className="w-5 h-5" />,
    },
    {
        path: RoutesAndUrls.ANALYTICS.urlPath,
        nameKey: RoutesAndUrls.ANALYTICS.pageName,
        icon: <TbBrandGoogleAnalytics  className="w-5 h-5" />,
    },
    {
        path: RoutesAndUrls.CONTENT.urlPath,
        nameKey: RoutesAndUrls.CONTENT.pageName,
        icon: <FiFile className="w-5 h-5" />,
        children: [
            {
                path: RoutesAndUrls.CONTENT_TEMPLATES.urlPath,
                nameKey: RoutesAndUrls.CONTENT_TEMPLATES.pageName,
                icon: <FiLayout className="w-4 h-4" />,
            },
            {
                path: RoutesAndUrls.CONTENT_SIGNUP_FORM.urlPath,
                nameKey: RoutesAndUrls.CONTENT_SIGNUP_FORM.pageName,
                icon: <FiEdit className="w-4 h-4" />,
            },
        ],
    },
    {
        path: RoutesAndUrls.AUDIENCE.urlPath,
        nameKey: RoutesAndUrls.AUDIENCE.pageName,
        icon: <FiUsers className="w-5 h-5" />,
        children: [
            {
                path: RoutesAndUrls.AUDIENCE_CONTACTS.urlPath,
                nameKey: RoutesAndUrls.AUDIENCE_CONTACTS.pageName,
                icon: <FiUsers className="w-4 h-4" />,
            },
            {
                path: RoutesAndUrls.AUDIENCE_INBOX.urlPath,
                nameKey: RoutesAndUrls.AUDIENCE_INBOX.pageName,
                icon: <FiInbox className="w-4 h-4" />,
            },
            {
                path: RoutesAndUrls.AUDIENCE_SEGMENTS.urlPath,
                nameKey: RoutesAndUrls.AUDIENCE_SEGMENTS.pageName,
                icon: <FiTag className="w-4 h-4" />,
            },
        ],
    },
    {
        path: RoutesAndUrls.CAMPAIGNS.urlPath,
        nameKey: RoutesAndUrls.CAMPAIGNS.pageName,
        icon: <FiSend className="w-5 h-5" />,
    },
    {
        path: RoutesAndUrls.AUTOMATIONS.urlPath,
        nameKey: RoutesAndUrls.AUTOMATIONS.pageName,
        icon: <FiRepeat className="w-5 h-5" />,
        children: [
            {
                path: RoutesAndUrls.AUTOMATIONS_OVERVIEW.urlPath,
                nameKey: RoutesAndUrls.AUTOMATIONS_OVERVIEW.pageName,
                icon: <FiActivity className="w-4 h-4" />,
            },
            {
                path: RoutesAndUrls.AUTOMATIONS_EMAIL_JOURNEYS.urlPath,
                nameKey: RoutesAndUrls.AUTOMATIONS_EMAIL_JOURNEYS.pageName,
                icon: <FiRepeat className="w-4 h-4" />,
            },
        ],
    },
    {
        path: RoutesAndUrls.USER.urlPath,
        nameKey: RoutesAndUrls.USER.pageName,
        icon: <FiUser className="w-5 h-5" />,
    },
];

