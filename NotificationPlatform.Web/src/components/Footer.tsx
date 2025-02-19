//TODO: Social Links, Translations, move links to PageUrls
import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export function Footer() {
  const socialLinks = [
    {
      name: 'Twitter',
      icon: <FaTwitter className="h-5 w-5" />,
      href: '#',
    },
    {
      name: 'GitHub',
      icon: <FaGithub className="h-5 w-5" />,
      href: '#',
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="h-5 w-5" />,
      href: '#',
    },
    {
      name: 'Email',
      icon: <FaEnvelope className="h-5 w-5" />,
      href: '#',
    },
  ];

  return (
    <footer className="bg-impolar-bg text-impolar-bg-text">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 sm:px-6 ">
        {/* Newsletter Section */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row">
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

          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Solutions</h4>
            <nav className="mt-4 space-y-2">
              {['Product', 'Features', 'Pricing', 'Demo'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>


          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Company</h4>
            <nav className="mt-4 space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Legal</h4>
            <nav className="mt-4 space-y-2">
              {['Privacy', 'Terms', 'Security', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-impolar-primary-text">Resources</h4>
            <nav className="mt-4 space-y-2">
              {['Documentation', 'Help Center', 'API Status', 'Guides'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-sm text-impolar-bg-text hover:text-impolar-secondary-text"
                >
                  {item}
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
