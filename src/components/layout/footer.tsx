import Link from 'next/link';
import { Github, Twitter, Instagram, Youtube, Linkedin, Heart } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

interface FooterProps {
  siteName?: string;
  footerText?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
  };
}

export function Footer({ siteName = 'Lumina', footerText = 'Premium media showcase platform', socialLinks = {} }: FooterProps) {
  const socials = [
    { icon: Twitter, url: socialLinks.twitter, label: 'Twitter' },
    { icon: Instagram, url: socialLinks.instagram, label: 'Instagram' },
    { icon: Youtube, url: socialLinks.youtube, label: 'YouTube' },
    { icon: Linkedin, url: socialLinks.linkedin, label: 'LinkedIn' },
    { icon: Github, url: socialLinks.github, label: 'GitHub' },
  ].filter((s) => s.url);

  return (
    <footer className="relative border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container-max px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold gradient-text">{siteName}</Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md">{footerText}</p>
            {socials.length > 0 && (
              <div className="flex items-center gap-3 mt-6">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-brand-500 hover:text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">Sign In</Link></li>
              <li><Link href="/auth/signup" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">Sign Up</Link></li>
              <li><Link href="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">Dashboard</Link></li>
              <li><Link href="/admin" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            Developed by
            <a
              href="https://prxsnt.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-500 hover:underline inline-flex items-center gap-1"
            >
              Prashant Kumar
              <Heart className="w-3 h-3 fill-brand-500 text-brand-500" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
