import type { ReactNode } from "react";
import Home from "./pages/home/Home";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import i18n from './i18n';
import Segments from "./pages/audience/Segments";
import { Contacts } from "./pages/contacts/Contacts";
import { UserPage } from "./pages/user/UserPage";

interface PageUrlsProps {
    pageName: string;
    urlPath: string;
    component?: ReactNode;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class RoutesAndUrls {
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
        component: <Contacts />,
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
        pageName: i18n.t('email_journeys'),
        urlPath: `/${i18n.t('automations').toLowerCase()}/${i18n.t('email_journeys').toLowerCase().replace(' ', '-')}`,
    };

    public static readonly USER: PageUrlsProps = {
        pageName: i18n.t('user'),
        urlPath: `/${i18n.t('user').toLowerCase()}`,
        component: <UserPage />,
    };
    // Footer links
    public static readonly PRODUCT: PageUrlsProps = {
        pageName: i18n.t('product'),
        urlPath: `/${i18n.t('product').toLowerCase()}`,
    };

    public static readonly FEATURES: PageUrlsProps = {
        pageName: i18n.t('features'),
        urlPath: `/${i18n.t('features').toLowerCase()}`,
    };

    public static readonly PRICING: PageUrlsProps = {
        pageName: i18n.t('pricing'),
        urlPath: `/${i18n.t('pricing').toLowerCase()}`,
    };

    public static readonly DEMO: PageUrlsProps = {
        pageName: i18n.t('demo'),
        urlPath: `/${i18n.t('demo').toLowerCase()}`,
    };

    public static readonly ABOUT: PageUrlsProps = {
        pageName: i18n.t('about'),
        urlPath: `/${i18n.t('about').toLowerCase()}`,
    };

    public static readonly BLOG: PageUrlsProps = {
        pageName: i18n.t('blog'),
        urlPath: `/${i18n.t('blog').toLowerCase()}`,
    };

    public static readonly CAREERS: PageUrlsProps = {
        pageName: i18n.t('careers'),
        urlPath: `/${i18n.t('careers').toLowerCase()}`,
    };

    public static readonly CONTACT: PageUrlsProps = {
        pageName: i18n.t('contact'),
        urlPath: `/${i18n.t('contact').toLowerCase()}`,
    };

    public static readonly PRIVACY: PageUrlsProps = {
        pageName: i18n.t('privacy'),
        urlPath: `/${i18n.t('privacy').toLowerCase()}`,
    };

    public static readonly TERMS: PageUrlsProps = {
        pageName: i18n.t('terms'),
        urlPath: `/${i18n.t('terms').toLowerCase()}`,
    };

    public static readonly SECURITY: PageUrlsProps = {
        pageName: i18n.t('security'),
        urlPath: `/${i18n.t('security').toLowerCase()}`,
    };

    public static readonly COOKIE_POLICY: PageUrlsProps = {
        pageName: i18n.t('cookie_policy'),
        urlPath: `/${i18n.t('cookie_policy').toLowerCase().replace('_', '-')}`,
    };

    public static readonly DOCUMENTATION: PageUrlsProps = {
        pageName: i18n.t('documentation'),
        urlPath: `/${i18n.t('documentation').toLowerCase()}`,
    };

    public static readonly HELP_CENTER: PageUrlsProps = {
        pageName: i18n.t('help_center'),
        urlPath: `/${i18n.t('help_center').toLowerCase().replace('_', '-')}`,
    };

    public static readonly API_STATUS: PageUrlsProps = {
        pageName: i18n.t('api_status'),
        urlPath: `/${i18n.t('api_status').toLowerCase().replace('_', '-')}`,
    };

    public static readonly GUIDES: PageUrlsProps = {
        pageName: i18n.t('guides'),
        urlPath: `/${i18n.t('guides').toLowerCase()}`,
    };


    //Socials
    public static readonly FACEBOOK: PageUrlsProps = {
        pageName: i18n.t('facebook'),
        urlPath: `/${i18n.t('facebook').toLowerCase()}`,
    };

    public static readonly TWITTER: PageUrlsProps = {
        pageName: i18n.t('twitter'),
        urlPath: `/${i18n.t('twitter').toLowerCase()}`,
    };

    public static readonly LINKEDIN: PageUrlsProps = {
        pageName: i18n.t('linkedin'),
        urlPath: `/${i18n.t('linkedin').toLowerCase()}`,
    };

    public static readonly YOUTUBE: PageUrlsProps = {
        pageName: i18n.t('youtube'),
        urlPath: `/${i18n.t('youtube').toLowerCase()}`,
    };

    public static readonly INSTAGRAM: PageUrlsProps = {
        pageName: i18n.t('instagram'),
        urlPath: `/${i18n.t('instagram').toLowerCase()}`,
    };

    public static readonly GITHUB: PageUrlsProps = {
        pageName: i18n.t('github'),
        urlPath: `/${i18n.t('github').toLowerCase()}`,
    };

    public static readonly DISCORD: PageUrlsProps = {
        pageName: i18n.t('discord'),
        urlPath: `/${i18n.t('discord').toLowerCase()}`,
    };

    public static readonly SLACK: PageUrlsProps = {
        pageName: i18n.t('slack'),
        urlPath: `/${i18n.t('slack').toLowerCase()}`,
    };

    public static readonly EMAIL: PageUrlsProps = {
        pageName: i18n.t('email'),
        urlPath: `/${i18n.t('email').toLowerCase()}`,
    };
    
}

const pageUrlsArray: PageUrlsProps[] = Object.values(RoutesAndUrls);

export default pageUrlsArray;