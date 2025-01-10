import React from 'react';
import { IconBrandGithub } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className="w-full bg-back-raised text-secondary-strong py-6 mt-10 px-4 text-center rounded-lg">
        <div className="flex justify-center gap-4">
        <a 
          href="https://github.com/samersawan/bookmarkd" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex flex-row gap-1 hover:underline"
        >
          <IconBrandGithub stroke={2} className="hover:underline" /> GitHub Repo
        </a>
        <a 
          href="mailto:me@samersawan.com?subject=Feedback%20on%20Bookmarkd" 
          className="flex flex-row gap-1 hover:underline"
        >
          <IconMail stroke={2} /> Send Feedback
        </a>
      </div>
      <p className="text-center justify-self-center my-4">Your feedback is greatly appreciated. Please feel free to write me an email or to check out the github repository for detailed instructions on how to report bugs and make suggestions</p>
      
      <p className="text-md">
        <span className="font-bold text-primary">Bookmarkd</span> is currently in development. Features and design are subject to change.
      </p>
    </footer>
  );
};

export default Footer;
