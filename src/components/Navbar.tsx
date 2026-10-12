import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { User } from '../types';
import { Menu, X, ArrowUpRight, LayoutDashboard, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenSignIn: () => void;
  onOpenContact: () => void;
  onOpenPartnerExplorer: () => void;
  currentUser?: User | null;
  onOpenDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenSignIn,
  onOpenContact,
  onOpenPartnerExplorer,
  currentUser,
  onOpenDashboard
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FFFEFA]/95 backdrop-blur-md shadow-[0_4px_20px_-8px_rgba(35,77,53,0.08)] border-b border-[#E6E2D8]' 
          : 'bg-[#FFFEFA] border-b border-[#E6E2D8]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark & Recovery Symbol */}
          <div className="shrink-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234D35] rounded-md p-1"
              aria-label="RESTOCK AI Homepage"
            >
              <Logo size="md" />
            </a>
          </div>

          {/* Zone 2: Primary Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#252A25]">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-[#252A25] hover:text-[#234D35] transition-colors py-1 relative group whitespace-nowrap"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#234D35] transition-all duration-200 group-hover:w-full" />
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              className="text-[#777A72] hover:text-[#234D35] transition-colors py-1 relative group whitespace-nowrap"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#234D35] transition-all duration-200 group-hover:w-full" />
            </a>
            <a 
              href="#solutions" 
              onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }}
              className="text-[#777A72] hover:text-[#234D35] transition-colors py-1 relative group whitespace-nowrap"
            >
              Solutions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#234D35] transition-all duration-200 group-hover:w-full" />
            </a>
            <a 
              href="#ai-intelligence" 
              onClick={(e) => { e.preventDefault(); scrollToSection('ai-intelligence'); }}
              className="text-[#777A72] hover:text-[#234D35] transition-colors py-1 relative group whitespace-nowrap"
            >
              AI Capabilities
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#234D35] transition-all duration-200 group-hover:w-full" />
            </a>
            <button 
              onClick={onOpenPartnerExplorer}
              className="text-[#777A72] hover:text-[#234D35] transition-colors py-1 relative group whitespace-nowrap cursor-pointer text-left"
            >
              Recovery Partners
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#234D35] transition-all duration-200 group-hover:w-full" />
            </button>
            <a 
              href="#trust" 
              onClick={(e) => { e.preventDefault(); scrollToSection('trust'); }}
              className="text-[#777A72] hover:text-[#234D35] transition-colors py-1 relative group whitespace-nowrap"
            >
              Responsibility
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#234D35] transition-all duration-200 group-hover:w-full" />
            </a>
            <button 
              onClick={onOpenContact}
              className="text-[#777A72] hover:text-[#234D35] transition-colors py-1 relative group whitespace-nowrap cursor-pointer text-left"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#234D35] transition-all duration-200 group-hover:w-full" />
            </button>
          </nav>

          {/* Zone 3: Actions (Sign In or Open Dashboard) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {currentUser && onOpenDashboard ? (
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={onOpenSignIn}
                  className="text-sm font-medium text-[#252A25] hover:text-[#234D35] px-3 py-2 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                {onOpenDashboard && (
                  <button 
                    onClick={onOpenDashboard}
                    className="text-xs font-semibold text-[#234D35] bg-[#DCE5D5]/80 hover:bg-[#DCE5D5] px-3.5 py-2 rounded-full border border-[#234D35]/20 transition-colors cursor-pointer"
                    title="Launch interactive business console"
                  >
                    Demo Console
                  </button>
                )}
                <button 
                  onClick={onOpenRegister}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4 opacity-80" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser && onOpenDashboard ? (
              <button
                onClick={onOpenDashboard}
                className="px-3 py-1.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] rounded-full flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Console</span>
              </button>
            ) : (
              <button
                onClick={onOpenRegister}
                className="px-3 py-1.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] rounded-full"
              >
                Start
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#252A25] hover:text-[#234D35] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234D35]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E6E2D8] bg-[#FFFEFA] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2 text-base font-medium text-[#252A25]">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              className="px-3 py-2 rounded-lg hover:bg-[#F7F4EC] transition-colors"
            >
              Home
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              className="px-3 py-2 rounded-lg hover:bg-[#F7F4EC] transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#solutions" 
              onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }}
              className="px-3 py-2 rounded-lg hover:bg-[#F7F4EC] transition-colors"
            >
              Solutions
            </a>
            <a 
              href="#ai-intelligence" 
              onClick={(e) => { e.preventDefault(); scrollToSection('ai-intelligence'); }}
              className="px-3 py-2 rounded-lg hover:bg-[#F7F4EC] transition-colors"
            >
              AI Capabilities
            </a>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenPartnerExplorer(); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#F7F4EC] transition-colors"
            >
              Recovery Partners
            </button>
            <a 
              href="#trust" 
              onClick={(e) => { e.preventDefault(); scrollToSection('trust'); }}
              className="px-3 py-2 rounded-lg hover:bg-[#F7F4EC] transition-colors"
            >
              Responsibility
            </a>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenContact(); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#F7F4EC] transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="pt-4 border-t border-[#E6E2D8] flex flex-col gap-2">
            {currentUser && onOpenDashboard ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                className="w-full text-center py-2.5 text-sm font-semibold text-[#FFFEFA] bg-[#234D35] rounded-xl shadow-sm"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenSignIn(); }}
                  className="w-full text-center py-2.5 text-sm font-medium text-[#252A25] border border-[#E6E2D8] rounded-xl hover:bg-[#F7F4EC]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-[#FFFEFA] bg-[#234D35] rounded-xl shadow-sm hover:bg-[#1a3a28]"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
