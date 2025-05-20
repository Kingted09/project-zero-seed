
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <div className="container flex flex-col md:flex-row md:h-16 items-center justify-between gap-4 md:gap-0">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Project. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
