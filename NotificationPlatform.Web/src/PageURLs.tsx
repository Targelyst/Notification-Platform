import { ReactNode } from "react";
import Home from "./pages/home/Home";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import i18n from './i18n';
import Segments from "./pages/audience/Segments";

interface PageUrlsProps {
    pageName: string;
    urlPath: string;
    component?: ReactNode;
}

export class PageUrls {
    public static readonly HOME: PageUrlsProps = {
        pageName: i18n.t('home'),
        urlPath: `/${i18n.t('home').toLowerCase()}`,
        component: <Home />,
    };

    public static readonly ANALYTICS: PageUrlsProps = {
        pageName: i18n.t('analytics'),
        urlPath: `/${i18n.t('analytics').toLowerCase()}`,
        component: <AnalyticsDashboard />,
    };

    public static readonly CONTENT: PageUrlsProps = {
        pageName: i18n.t('content'),
        urlPath: `/${i18n.t('content').toLowerCase()}`,
    };

    public static readonly CONTENT_TEMPLATES: PageUrlsProps = {
        pageName: i18n.t('templates'),
        urlPath: `/${i18n.t('content').toLowerCase()}/${i18n.t('templates').toLowerCase()}`,
    };

    public static readonly CONTENT_SIGNUP_FORM: PageUrlsProps = {
        pageName: i18n.t('signup_form'),
        urlPath: `/${i18n.t('content').toLowerCase()}/${i18n.t('signup form').toLowerCase().replace(' ', '-')}`,
    };

    public static readonly AUDIENCE: PageUrlsProps = {
        pageName: i18n.t('audience'),
        urlPath: `/${i18n.t('audience').toLowerCase()}`,
    };

    public static readonly AUDIENCE_CONTACTS: PageUrlsProps = {
        pageName: i18n.t('Contacts'),
        urlPath: `/${i18n.t('audience').toLowerCase()}/${i18n.t('contacts').toLowerCase()}`,
    };

    public static readonly AUDIENCE_INBOX: PageUrlsProps = {
        pageName: i18n.t('inbox'),
        urlPath: `/${i18n.t('audience').toLowerCase()}/${i18n.t('inbox').toLowerCase()}`,
    };

    public static readonly AUDIENCE_SEGMENTS: PageUrlsProps = {
        pageName: i18n.t('segments'),
        urlPath: `/${i18n.t('audience').toLowerCase()}/${i18n.t('segments').toLowerCase()}`,
        component: <Segments />,
    };

    public static readonly CAMPAIGNS: PageUrlsProps = {
        pageName: i18n.t('campaigns'),
        urlPath: `/${i18n.t('campaigns').toLowerCase()}`,
    };

    public static readonly AUTOMATIONS: PageUrlsProps = {
        pageName: i18n.t('automations'),
        urlPath: `/${i18n.t('automations').toLowerCase()}`,
    };

    public static readonly AUTOMATIONS_OVERVIEW: PageUrlsProps = {
        pageName: i18n.t('overview'),
        urlPath: `/${i18n.t('automations').toLowerCase()}/${i18n.t('overview').toLowerCase()}`,
    };

    public static readonly AUTOMATIONS_EMAIL_JOURNEYS: PageUrlsProps = {
        pageName: i18n.t('email journeys'),
        urlPath: `/${i18n.t('automations').toLowerCase()}/${i18n.t('email journeys').toLowerCase().replace(' ', '-')}`,
    };

    public static readonly USER: PageUrlsProps = {
        pageName: i18n.t('user'),
        urlPath: `/${i18n.t('user').toLowerCase()}`,
    };
}

const pageUrlsArray: PageUrlsProps[] = Object.values(PageUrls);

export default pageUrlsArray;