import React from 'react';
import { IconBrandGithub, IconMail } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-stroke-weak/30 mt-16 pt-8 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-primary mb-1">BOOKMARKD</h3>
            <p className="text-secondary-weak text-sm">Track your reading journey</p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://github.com/samersawan/bookmarkd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
            >
              <IconBrandGithub stroke={2} size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
            <a
              href="mailto:me@samersawan.com?subject=Feedback%20on%20Bookmarkd"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
            >
              <IconMail stroke={2} size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Send Feedback</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stroke-weak/20 mb-4"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-secondary-weak text-xs">
            Currently in development. Features and design are subject to change.
          </p>
          <p className="text-secondary-weak text-xs">
            Built by <a href="https://samersawan.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light hover:underline transition-colors">Samer Sawan</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
