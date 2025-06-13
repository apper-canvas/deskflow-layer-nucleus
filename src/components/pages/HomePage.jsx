import React from 'react';
import HeroSection from '@/components/organisms/HeroSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <HeroSection />
    </div>
  );
};

export default HomePage;