import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, navItems } from './Sidebar';
import { Header } from './Header';
import { DemoBanner } from '../ui/DemoBanner';

export function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine page title based on current path
  const currentNavItem = navItems.find((item) => item.path === location.pathname);
  const currentTitle = currentNavItem ? currentNavItem.name : 'Clinical Safety Platform';

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Persistent synthetic demo data banner */}
      <DemoBanner />

      {/* Body container: Sidebar + Main Shell Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
          {/* Header Bar */}
          <Header
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            currentTitle={currentTitle}
          />

          {/* Main Scrollable Viewport */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 focus:outline-none" id="main-content">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
