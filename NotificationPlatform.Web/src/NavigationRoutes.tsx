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

import { PageUrls } from "./PageURLs"; 

export interface NavigationRouteConfig {
	path: string;
	nameKey: string;
	icon: ReactNode;
	children?: NavigationRouteConfig[];
}

export const NavigationRoutes: NavigationRouteConfig[] = [
    {
        path: PageUrls.HOME.urlPath,
        nameKey: PageUrls.HOME.pageName,
        icon: <FiHome className="w-5 h-5" />,
    },
    {
        path: PageUrls.ANALYTICS.urlPath,
        nameKey: PageUrls.ANALYTICS.pageName,
        icon: <FiActivity className="w-5 h-5" />,
    },
    {
        path: PageUrls.CONTENT.urlPath,
        nameKey: PageUrls.CONTENT.pageName,
        icon: <FiFile className="w-5 h-5" />,
        children: [
            {
                path: PageUrls.CONTENT_TEMPLATES.urlPath,
                nameKey: PageUrls.CONTENT_TEMPLATES.pageName,
                icon: <FiLayout className="w-4 h-4" />,
            },
            {
                path: PageUrls.CONTENT_SIGNUP_FORM.urlPath,
                nameKey: PageUrls.CONTENT_SIGNUP_FORM.pageName,
                icon: <FiEdit className="w-4 h-4" />,
            },
        ],
    },
    {
        path: PageUrls.AUDIENCE.urlPath,
        nameKey: PageUrls.AUDIENCE.pageName,
        icon: <FiUsers className="w-5 h-5" />,
        children: [
            {
                path: PageUrls.AUDIENCE_CONTACTS.urlPath,
                nameKey: PageUrls.AUDIENCE_CONTACTS.pageName,
                icon: <FiUsers className="w-4 h-4" />,
            },
            {
                path: PageUrls.AUDIENCE_INBOX.urlPath,
                nameKey: PageUrls.AUDIENCE_INBOX.pageName,
                icon: <FiInbox className="w-4 h-4" />,
            },
            {
                path: PageUrls.AUDIENCE_SEGMENTS.urlPath,
                nameKey: PageUrls.AUDIENCE_SEGMENTS.pageName,
                icon: <FiTag className="w-4 h-4" />,
            },
        ],
    },
    {
        path: PageUrls.CAMPAIGNS.urlPath,
        nameKey: PageUrls.CAMPAIGNS.pageName,
        icon: <FiSend className="w-5 h-5" />,
    },
    {
        path: PageUrls.AUTOMATIONS.urlPath,
        nameKey: PageUrls.AUTOMATIONS.pageName,
        icon: <FiRepeat className="w-5 h-5" />,
        children: [
            {
                path: PageUrls.AUTOMATIONS_OVERVIEW.urlPath,
                nameKey: PageUrls.AUTOMATIONS_OVERVIEW.pageName,
                icon: <FiActivity className="w-4 h-4" />,
            },
            {
                path: PageUrls.AUTOMATIONS_EMAIL_JOURNEYS.urlPath,
                nameKey: PageUrls.AUTOMATIONS_EMAIL_JOURNEYS.pageName,
                icon: <FiRepeat className="w-4 h-4" />,
            },
        ],
    },
    {
        path: PageUrls.USER.urlPath,
        nameKey: PageUrls.USER.pageName,
        icon: <FiUser className="w-5 h-5" />,
    },
];

