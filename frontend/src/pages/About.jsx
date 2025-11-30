import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Award, Heart, Sparkles, Users } from 'lucide-react';
import { assets } from '../assets/assets';
import back2 from '../assets/back2.jpg';


// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
  </div>
);

// Error Boundary Compone
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Service Card Component
const ServiceCard = ({ title, description, icon: Icon, imageSrc, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={imageSrc} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 text-white">
          <Icon className="w-5 h-5" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Value Card Component
const ValueCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="flex flex-col items-center text-center p-6"
  >
    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-pink-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

// Simple Image Gallery Component
const SimpleGallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80"
  ];

  return (
    <div className="mb-20">
      {/* <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Work</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <img 
              src={src} 
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </motion.div>
        ))}
      </div> */}
    </div>
  );
};

// Main About Page Component
const AboutPage = () => {
  const services = [
    {
      title: "Hair Styling",
      description: "Expert styling services tailored to your unique preferences and hair type. Our skilled stylists stay current with the latest trends and techniques to create your perfect look.",
      icon: Sparkles,
      imageSrc: assets.back4
    },
    {
      title: "Natural Hair Care",
      description: "Specialized treatments and styling for natural hair, focusing on health and beauty. We use premium products and techniques to enhance your natural texture.",
      icon: Heart,
      imageSrc: assets.back2
    },
    {
      title: "Hair Replacement",
      description: "Professional hair replacement solutions with natural-looking results. Our discrete, personalized services help restore your confidence and style.",
      icon: Award,
      imageSrc: assets.single
    },
  ];

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in every service we provide"
    },
    {
      icon: Heart,
      title: "Care",
      description: "Your comfort and satisfaction are our top priorities"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "We stay ahead with the latest beauty trends and techniques"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building lasting relationships with our valued clients"
    }
  ];

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section with Background Image */}
          <div className="relative h-[500px] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${back2})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 to-purple-900/80"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
            >
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4"
              >
                Welcome to PalmsBeautyStore
              </motion.h1>
              <p className="text-xl md:text-2xl text-pink-100 max-w-2xl">
                Your Premier Beauty Destination in St. John's, Newfoundland and Labrador
              </p>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Introduction with Side Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-12 items-center mb-20"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  At PalmsBeautyStore, we believe that everyone deserves to feel beautiful and confident. 
                  Our dedicated team of beauty experts is passionate about helping you discover and enhance 
                  your natural beauty through our comprehensive range of services.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  With years of experience and a commitment to excellence, we've become St. John's trusted 
                  destination for transformative beauty experiences.
                </p>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80"
                  alt="Beauty salon interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

           

            {/* Services Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Our Services</h2>
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                Discover our range of professional beauty services, each designed to bring out your best
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <ServiceCard key={index} {...service} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Image Gallery */}
            <SimpleGallery />

            {/* Mission Statement with Background */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-lg overflow-hidden my-20"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80')",
                }}
              >
                <div className="absolute inset-0 bg-pink-900/85"></div>
              </div>
              <div className="relative px-8 py-16 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Our Commitment</h2>
                <p className="text-lg text-pink-50 leading-relaxed">
                  Our commitment to excellence extends beyond our services. We pride ourselves on 
                  creating a welcoming environment where every client receives personalized attention 
                  and leaves feeling transformed. Our team stays up-to-date with the latest beauty 
                  trends and techniques to ensure you receive the highest quality service.
                </p>
              </div>
            </motion.div>

      
          </div>
        </div>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default AboutPage;