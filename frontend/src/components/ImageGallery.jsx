import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';


const ImageGallery = () => {
    const images = [
      {
        src: assets.pic1,
        alt: "Professional hair styling service",
        caption: "Expert Hair Styling"
      },
      {
        src: assets.pic2,
        alt: "Natural hair care treatment",
        caption: "Natural Hair Care"
      },
      {
        src: assets.pic3,
        alt: "Hair replacement service",
        caption: "Hair Replacement Solutions"
      },
      {
        src: assets.pic4,
        alt: "Professional makeup application",
        caption: "Makeup Services"
      },
      {
        src: assets.pic5,
        alt: "Salon interior",
        caption: "Our Modern Facility"
      },
      // {
      //   src: "/api/placeholder/600/400",
      //   alt: "Client consultation",
      //   caption: "Personalized Consultations"
      // }
    ];
  
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-gray-800 mb-8"
          >
            Our Beauty Sanctuary
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-lg font-semibold">{image.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default ImageGallery 