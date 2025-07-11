




// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { beautyServices, braidingServices } from '../assets/assets';
// import { Loader2 } from 'lucide-react';
// import SEO from '../components/SEO';
// import VideoBackground from '../components/VideoBackground';
// import ServiceNavigation from '../components/ServiceNavigation';
// import ServiceCard from '../components/ServiceCard';

// // Main Services Page Component
// const Services = () => {
//   const [activeSection, setActiveSection] = useState('hair');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate loading state
//     setTimeout(() => setIsLoading(false), 1000);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <SEO />

//       {/* Hero Section */}
//       <div className="relative h-[60vh] text-white">
//         <VideoBackground videoSrc="./bg-video.mp4" />
//         <div className="relative z-10 h-full flex items-center justify-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center"
//           >
//             <h1 className="text-4xl md:text-6xl font-bold mb-4">
//               Our Services
//             </h1>
//             <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
//               Experience luxury beauty services tailored to your unique style
//             </p>
//           </motion.div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <ServiceNavigation
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//         />

//         {/* Services Sections */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           {activeSection === 'hair' && (
//             <section id="hair" className="space-y-8">
//               <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
//                 Hair & Braiding Services
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {braidingServices.map((service) => (
//                   <ServiceCard key={service.id} {...service} />
//                 ))}
//               </div>
//             </section>
//           )}

//           {activeSection === 'beauty' && (
//             <section id="beauty" className="space-y-8">
//               <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
//                 Beauty Services
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {beautyServices.map((service) => (
//                   <ServiceCard key={service.id} {...service} />
//                 ))}
//               </div>
//             </section>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Services;




// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import ServiceCard from '../components/ServiceCard';
// import { Loader2 } from 'lucide-react';
// const backendUrl = 'http://localhost:3000'; // Replace with your actual backend URL

// const Services = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchServices();
//   }, []);

//  const fetchServices = async () => {
//   try {
//     setLoading(true);
//    const response = await axios.get(`${backendUrl}/api/publicservices`);
// setServices(response.data);

//   } catch (err) {
//     setError(err.response?.data?.message || err.message || 'Something went wrong');
//   } finally {
//     setLoading(false);
//   }
// };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-600">Error loading services: {error}</p>
//         <button 
//           onClick={fetchServices}
//           className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const activeServices = services.filter(service => service.isActive);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-8">Our Services</h1>
      
//       {activeServices.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600">No services available at the moment.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {activeServices.map((service) => (
//             <ServiceCard
//               key={service.id}
//               id={service.id}
//               title={service.title}
//               description={service.description}
//               duration={service.duration}
//               price={service.price}
//               image={service.image}
//               isActive={service.isActive}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Services;





import axios from 'axios';
import { useState, useEffect } from 'react';
// import ServiceCard from '../components/ServiceCard';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
const backendUrl = 'http://localhost:3000'; // Replace with your deployed backend URL

const Services = () => {
  const [services, setServices] = useState([]); // array of categories
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/services/publicservices`);
      setServices(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleBook = (service) => {
    // Navigate to booking page or open a modal
    alert(`You clicked Book Now for: ${service.title}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading services: {error}</p>
        <button
          onClick={fetchServices}
          className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Service</h1>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No services available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {services.map((category) => (
            <div key={category._id}>
              <button
                onClick={() => toggleCategory(category._id)}
                className="flex items-center justify-between w-full text-left text-2xl font-semibold mb-4 text-gray-900 focus:outline-none"
              >
                <span>{category.title}</span>
                {expanded[category._id] ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              {expanded[category._id] && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.subServices.map((service) => (
                    <ServiceCard
                      key={service._id}
                      title={service.title}
                      description={service.description}
                      duration={service.duration}
                      price={service.price}
                      image={service.image}
                      onBook={() => handleBook(service)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
