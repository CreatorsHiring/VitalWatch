import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import PatientSafety from '../components/PatientSafety';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Directly navigate to the split-screen login workspace page
  const handleOpenLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#EAF7F0] selection:text-[#105C43]">
      {/* Sticky Header */}
      <Header onOpenLogin={handleOpenLogin} />

      {/* Main Page Content */}
      <main className="flex-1">
        <Hero onOpenLogin={handleOpenLogin} />
        <Features />
        <HowItWorks />
        <PatientSafety />
      </main>

      {/* Footer */}
      <Footer onOpenLogin={handleOpenLogin} />

      {/* Role Selection Modal (available if explicitly triggered) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
