import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';

// SEO Component
const SEO = () => (
  <Helmet>
    <title>About Us - PalmsBeautyStore | Beauty Salon in St. John's, NL</title>
    <meta name="description" content="PalmsBeautyStore in St. John's, NL specializes in hair styling, natural hair care, hair replacement, and makeup services. Visit us for a transformative beauty experience." />
    <meta name="keywords" content="beauty salon, hair salon, makeup services, St. John's, Newfoundland and Labrador, natural hair care, hair replacement" />
    <meta property="og:title" content="About PalmsBeautyStore - Your Premier Beauty Destination" />
    <meta property="og:description" content="Discover exceptional beauty services at PalmsBeautyStore in St. John's, NL. Specializing in hair styling, natural hair care, and makeup." />
    <meta property="og:type" content="website" />
    <link rel="canonical" href="/about" />
  </Helmet>
);

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
  </div>
);

// Error Boundary Component
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
const ServiceCard = ({ title, description, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
  >
    <h3 className="text-xl font-semibold text-pink-600 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

// Main About Page Component
const AboutPage = () => {
  const services = [
    {
      title: "Hair Styling",
      description: "Expert styling services tailored to your unique preferences and hair type. Our skilled stylists stay current with the latest trends and techniques to create your perfect look."
    },
    {
      title: "Natural Hair Care",
      description: "Specialized treatments and styling for natural hair, focusing on health and beauty. We use premium products and techniques to enhance your natural texture."
    },
    {
      title: "Hair Replacement",
      description: "Professional hair replacement solutions with natural-looking results. Our discrete, personalized services help restore your confidence and style."
    },
    {
      title: "Makeup Services",
      description: "From natural day looks to glamorous evening styles, our makeup artists create flawless looks for any occasion using high-quality, long-lasting products."
    }
  ];

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen bg-gray-50">
          <SEO />
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-pink-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl md:text-5xl font-bold text-pink-600 mb-4"
            >
              Welcome to PalmsBeautyStore
            </motion.h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your Premier Beauty Destination in St. John's, Newfoundland and Labrador
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Introduction */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                At PalmsBeautyStore, we believe that everyone deserves to feel beautiful and confident. 
                Our dedicated team of beauty experts is passionate about helping you discover and enhance 
                your natural beauty through our comprehensive range of services.
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} index={index} />
              ))}
            </div>


              {/* Image Gallery */}
              <ImageGallery />


            {/* Mission Statement */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment to excellence extends beyond our services. We pride ourselves on 
                creating a welcoming environment where every client receives personalized attention 
                and leaves feeling transformed. Our team stays up-to-date with the latest beauty 
                trends and techniques to ensure you receive the highest quality service.
              </p>
            </motion.div>

            {/* Location Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-8 text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Visit Us</h2>
              <p className="text-gray-600 mb-2">Located in the heart of St. John's, Newfoundland and Labrador</p>
              {/* <p className="text-gray-600">Experience the difference at PalmsBeautyStore and let us help you bring out your inner beauty.</p> */}
              <button 
                className="mt-6 px-6 py-3 bg-pink-600 text-white cursor-pointer rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={() => window.location.href = '/services'}
              >
                Book an Appointment
              </button>
            </motion.div>
          </div>
        </div>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default AboutPage;