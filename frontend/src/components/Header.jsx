import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Header({ onOpenLogin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Patient Safety', href: '#patient-safety' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E2EAE5]'
          : 'bg-white border-b border-[#E2EAE5]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={(e) => handleNavClick(e, '#home')}
            className="cursor-pointer transition-opacity hover:opacity-90"
          >
            <Logo size="default" showTagline={true} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3.5 py-2 text-sm font-medium text-[#172B24] hover:text-[#16845B] hover:bg-[#F7FAF8] rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Button: Staff Login */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#16845B] hover:bg-[#105C43] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16845B] text-white text-xs font-semibold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#64746C] hover:text-[#172B24] hover:bg-[#F7FAF8] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2EAE5] bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-[#172B24] hover:bg-[#F7FAF8] hover:text-[#16845B]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E2EAE5]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#16845B] hover:bg-[#105C43] text-white text-sm font-semibold shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Hospital Staff Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
