import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarketOverview from './components/MarketOverview';
import CommunityIdeas from './components/CommunityIdeas';
import TopStories from './components/TopStories';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#131722]">
      <Navbar />
      <div className="pt-[52px]">
        <Hero />
        <MarketOverview />
        <CommunityIdeas />
        <TopStories />
        <FeaturesSection />
        <PricingSection />
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
