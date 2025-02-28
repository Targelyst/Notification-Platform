//TODO: Maybe move the social links to a separate component
// Translations
import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope, FaFacebook, FaInstagram, FaSlack, FaDiscord, FaYoutube } from 'react-icons/fa';
import { RoutesAndUrls } from '../RoutesAndUrls';
import * as CookieConsent from "vanilla-cookieconsent";
import { useEffect } from 'react';
import pluginConfig from '../CookieConsentConfig';
import { BiCookie } from 'react-icons/bi';
import "vanilla-cookieconsent/dist/cookieconsent.css";

export function Footer() {

  useEffect(() => {
    CookieConsent.run(pluginConfig);
  }, []);
  const socialLinks = [
    {
      name: RoutesAndUrls.TWITTER.pageName,
      icon: <FaTwitter className="h-5 w-5" />,
      href: RoutesAndUrls.TWITTER.urlPath,
    },
    {
      name: RoutesAndUrls.GITHUB.pageName,
      icon: <FaGithub className="h-5 w-5" />,
      href: RoutesAndUrls.GITHUB.urlPath,
    },
    {
      name: RoutesAndUrls.LINKEDIN.pageName,
      icon: <FaLinkedin className="h-5 w-5" />,
      href: RoutesAndUrls.LINKEDIN.urlPath,
    },
    {
      name: RoutesAndUrls.EMAIL.pageName,
      icon: <FaEnvelope className="h-5 w-5" />,
      href: RoutesAndUrls.EMAIL.urlPath,
    },
    {
      name: RoutesAndUrls.FACEBOOK.pageName,
      icon: <FaFacebook className="h-5 w-5" />,
      href: RoutesAndUrls.FACEBOOK.urlPath,
    },
    {
      name: RoutesAndUrls.INSTAGRAM.pageName,
      icon: <FaInstagram className="h-5 w-5" />,
      href: RoutesAndUrls.INSTAGRAM.urlPath,
    },
    {
      name: RoutesAndUrls.SLACK.pageName,
      icon: <FaSlack className="h-5 w-5" />,
      href: RoutesAndUrls.SLACK.urlPath,
    },
    {
      name: RoutesAndUrls.DISCORD.pageName,
      icon: <FaDiscord className="h-5 w-5" />,
      href: RoutesAndUrls.DISCORD.urlPath,
    },
    {
      name: RoutesAndUrls.YOUTUBE.pageName,
      icon: <FaYoutube className="h-5 w-5" />,
      href: RoutesAndUrls.YOUTUBE.urlPath,
    },
  ];

  return (
    <footer className="bg-impolar-bg text-impolar-bg-text">
      <div className="px-4 pt-12 pb-8 sm:px-20">
        {/* Newsletter Section */}
        <div className="mb-16 flex flex-col justify-between gap-8 xl:flex-row border-b border-impolar-bg-highlight pb-4">
          <div className="max-w-md space-y-4 ">
            <h2 className="text-2xl font-bold text-impolar-bg-text">
              Sign up to our newsletter
            </h2>
            <p className="text-sm text-impolar-bg-surface-text">
              Stay up to date with the latest features and updates from Impolar. Never miss an announcement.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-4 sm:max-w-96">
            <div className="flex rounded-lg bg-impolar-bg-surface ">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md bg-impolar-bg-surface px-4  text-impolar-bg-text outline-none "
              />
              <button
                type="button"
                className="rounded-md bg-impolar-primary px-6 py-2 font-medium text-impolar-primary-text transition-colors hover:bg-opacity-90"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-impolar-bg-text">
              We care about your privacy. No spam, ever.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 ">
          {/* Brand Column */}
          <div className="col-span-2 space-y-6 md:col-span-1 ">
            <h3 className="text-lg font-medium text-impolar-primary">Impolar Logo</h3>
            <p className="text-sm text-impolar-bg-text">
              Building the future of digital experiences
            </p>
            {/* Add Cookie Icon */}
            <button
              type="button"
              onClick={() => CookieConsent.showPreferences()}
              className="text-impolar-bg-text hover:text-impolar-primary transition-colors"
              aria-label="Cookie preferences"
            >
              <BiCookie className="h-6 w-6" />
            </button>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Solutions</h4>
            <nav className="mt-4 space-y-2">
              {[RoutesAndUrls.PRODUCT, RoutesAndUrls.FEATURES, RoutesAndUrls.PRICING, RoutesAndUrls.DEMO].map((item) => (
                <a
                  key={item.pageName}
                  href={item.urlPath}
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item.pageName}
                </a>
              ))}
            </nav>
          </div>


          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Company</h4>
            <nav className="mt-4 space-y-2">
              {[RoutesAndUrls.ABOUT, RoutesAndUrls.BLOG, RoutesAndUrls.CAREERS, RoutesAndUrls.CONTACT].map((item) => (
                <a
                  key={item.pageName}
                  href={item.urlPath}
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item.pageName}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Legal</h4>
            <nav className="mt-4 space-y-2">
              {[RoutesAndUrls.PRIVACY, RoutesAndUrls.TERMS, RoutesAndUrls.SECURITY, RoutesAndUrls.COOKIE_POLICY].map((item) => (
                <a
                  key={item.pageName}
                  href={item.urlPath}
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item.pageName}
                </a>
              ))}
            </nav>
          </div>
          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Resources</h4>
            <nav className="mt-4 space-y-2">
              {[RoutesAndUrls.DOCUMENTATION, RoutesAndUrls.HELP_CENTER, RoutesAndUrls.API_STATUS, RoutesAndUrls.GUIDES].map((item) => (
                <a
                  key={item.pageName}
                  href={item.urlPath}
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item.pageName}
                </a>
              ))}
            </nav>
          </div>

        </div>


        {/* Copyright Section */}
        <div className="mt-12 border-t border-impolar-bg-highlight pt-8 flex flex-col md:flex-row justify-between">
          <div>
            <p className="text-xs text-impolar-bg-text">
              &copy; {new Date().getFullYear()} Impolar. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-impolar-bg-text transition-colors hover:text-impolar-primary"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
