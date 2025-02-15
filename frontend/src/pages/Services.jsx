




import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { beautyServices, braidingServices } from '../assets/assets';
import { Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import VideoBackground from '../components/VideoBackground';
import ServiceNavigation from '../components/ServiceNavigation';
import ServiceCard from '../components/ServiceCard';

// Main Services Page Component
const Services = () => {
  const [activeSection, setActiveSection] = useState('hair');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO />

      {/* Hero Section */}
      <div className="relative h-[60vh] text-white">
        <VideoBackground videoSrc="./bg-video.mp4" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Our Services
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
              Experience luxury beauty services tailored to your unique style
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ServiceNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Services Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeSection === 'hair' && (
            <section id="hair" className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                Hair & Braiding Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {braidingServices.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
            </section>
          )}

          {activeSection === 'beauty' && (
            <section id="beauty" className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                Beauty Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {beautyServices.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;