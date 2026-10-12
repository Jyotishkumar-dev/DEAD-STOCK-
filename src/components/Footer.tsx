import React from 'react';
import { Logo } from './Logo';
import { Twitter, Linkedin, Github, Mail, Globe, Shield } from 'lucide-react';

interface FooterProps {
  onOpenRegister: () => void;
  onOpenPartnerExplorer: () => void;
  onOpenContact: () => void;
  onOpenPartnerOnboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegister,
  onOpenPartnerExplorer,
  onOpenContact,
  onOpenPartnerOnboard
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FFFEFA] border-t border-[#E6E2D8] text-[#252A25] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Brand Column + 4 Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-14 border-b border-[#E6E2D8]">
          
          {/* Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            
            <p className="text-xs sm:text-sm text-[#777A72] leading-relaxed max-w-sm">
              An intelligent platform for resource recovery, reuse, and responsible electronic waste coordination.
            </p>

            <div className="pt-2 flex items-center gap-3 text-[#626B45]">
              <a 
                href="#social-twitter" 
                onClick={(e) => e.preventDefault()} 
                className="w-8 h-8 rounded-full bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-center hover:bg-[#234D35] hover:text-white transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#social-linkedin" 
                onClick={(e) => e.preventDefault()} 
                className="w-8 h-8 rounded-full bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-center hover:bg-[#234D35] hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#social-github" 
                onClick={(e) => e.preventDefault()} 
                className="w-8 h-8 rounded-full bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-center hover:bg-[#234D35] hover:text-white transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <button 
                onClick={onOpenContact} 
                className="w-8 h-8 rounded-full bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-center hover:bg-[#234D35] hover:text-white transition-colors cursor-pointer"
                aria-label="Email Inquiry"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 1: PLATFORM */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#234D35]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#777A72]">
              <li>
                <button 
                  onClick={() => scrollTo('how-it-works')} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('ai-intelligence')} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  AI Capabilities
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('categories')} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Recovery Categories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('solutions')} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Solutions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: FOR BUSINESSES */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#234D35]">
              For Businesses
            </h4>
            <ul className="space-y-2 text-xs text-[#777A72]">
              <li>
                <button 
                  onClick={onOpenRegister} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Register Your Business
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenRegister} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Submit E-Waste
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenRegister} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Track Requests
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('case-studies')} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Use Cases
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: FOR PARTNERS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#234D35]">
              For Partners
            </h4>
            <ul className="space-y-2 text-xs text-[#777A72]">
              <li>
                <button 
                  onClick={onOpenPartnerOnboard} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Become a Recovery Partner
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPartnerExplorer} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Partner Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('trust')} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Intake Standards
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: COMPANY */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#234D35]">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#777A72]">
              <li>
                <button 
                  onClick={() => scrollTo('home')} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenContact} 
                  className="hover:text-[#234D35] transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  onClick={(e) => { e.preventDefault(); onOpenContact(); }}
                  className="hover:text-[#234D35] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  onClick={(e) => { e.preventDefault(); onOpenContact(); }}
                  className="hover:text-[#234D35] transition-colors cursor-pointer"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777A72]">
          <div>
            © {new Date().getFullYear()} RESTOCK AI Inc. All rights reserved. Give Every Resource a Second Life.
          </div>
          <div className="text-[11px] text-[#777A72]/80">
            Smarter recovery · Better reuse · Less waste
          </div>
        </div>

      </div>
    </footer>
  );
};
