import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GallerySection = ({ images, title = "", ctaText = "View Complete Portfolio", onCtaClick }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length 
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <>
      <section id="portfolio" className="py-10 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-neutral-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-neutral-600 font-light">
              Stunning transformations by our expert beauty professionals.
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="masonry-grid mb-8">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="masonry-item cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={image.before}
                    alt={image.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-light mb-1">{image.title}</h3>
                      <p className="text-sm text-neutral-200 font-light">Click to view transformation</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          {ctaText && onCtaClick && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <button
                onClick={onCtaClick}
                className="bg-pink-900 text-white px-12 py-4 rounded-full font-light text-lg hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide"
              >
                {ctaText}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-6 text-white/80 hover:text-white transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-6 text-white/80 hover:text-white transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Before Image */}
                <div className="relative">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-light text-neutral-900 z-10">
                    Before
                  </div>
                  <img
                    src={selectedImage.before}
                    alt="Before"
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                </div>

                {/* After Image */}
                <div className="relative">
                  <div className="absolute top-4 left-4 bg-pink-900/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-light text-white z-10">
                    After
                  </div>
                  <img
                    src={selectedImage.after}
                    alt="After"
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-3xl font-light text-white mb-2">{selectedImage.title}</h3>
                <p className="text-neutral-400 font-light">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
       

        .masonry-item:nth-child(3n + 1) {
          --row-span: 20;
        }

        .masonry-item:nth-child(3n + 2) {
          --row-span: 18;
        }

        .masonry-item:nth-child(3n + 3) {
          --row-span: 22;
        }

      .masonry-grid {
  column-count: 3;
  column-gap: 1.5rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .masonry-grid {
    column-count: 1;
  }
}

        }
      `}</style>
    </>
  );
};

export default GallerySection;
