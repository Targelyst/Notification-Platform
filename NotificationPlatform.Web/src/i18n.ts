import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: "Home",
      analytics: "Analytics",
      content: "Content",
      templates: "Templates",
      signup_form: "Signup Form",
      audience: "Audience",
      contacts: "Contacts",
      inbox: "Inbox",
      segments: "Segments",
      campaigns: "Campaigns",
      automations: "Automations",
      overview: "Overview",
      email_journeys: "Email Journeys",
      settings: "Settings",
      logout: "Logout",
      shop: "Shop",
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;