// import { assets, beautyServices, braidingServices } from "../assets/assets";
// import ServiceCard from "../components/ServiceCard";
// import SectionTitle from "../components/SectionTitle";
// const Services = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-gray-900 relative text-white py-20 px-4">
//         <video
//           className="absolute top-0 left-0 w-full h-full object-cover z-0 sm:border-4 border-gray-800 lg:hidden"
//           autoPlay
//           loop
//           muted
//           playsInline
//           src={assets.bg_video}
//         ></video>
//         {/* <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Palms Beauty Services</h1>
//           <p className="text-xl text-gray-200">Elevate Your Beauty with Our Expert Services</p>
//         </div> */}
//         {/* Content Overlay */}
//         <div className="relative z-10 bg-transparent bg-opacity-50 text-white py-20 px-4 h-full flex items-center justify-center">
//           <div className="max-w-7xl mx-auto text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               Palms Beauty Services
//             </h1>
//             <p className="text-xl text-gray-200">
//               Elevate Your Beauty with Our Expert Services
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         {/* Services Navigation */}
//         <div className="flex justify-center space-x-6 mb-12">
//           <a
//             href="#hair"
//             className="text-gray-600 hover:text-gray-800 font-medium"
//           >
//             Hair & Braiding
//           </a>
//           <a
//             href="#beauty"
//             className="text-gray-600 hover:text-gray-800 font-medium"
//           >
//             Beauty Services
//           </a>
//         </div>

//         {/* Hair & Braiding Section */}
//         <section id="hair" className="mb-20">
//           <SectionTitle>Hair & Braiding</SectionTitle>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {braidingServices.map((service, index) => (
//               <ServiceCard key={service.id} {...service} />
//             ))}
//           </div>
//         </section>

//         {/* Beauty Services Section */}
//         <section id="beauty">
//           <SectionTitle>Beauty Services</SectionTitle>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {beautyServices.map((service, index) => (
//               <ServiceCard key={service.id} {...service} />
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Services;




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