import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = ({ navigate, clientImages }) => {
  return (
    <section className="py-16 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-pink-900 relative overflow-hidden border rounded-3xl mx-6 lg:mx-8"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-foreground/30 rounded-full blur-3xl"
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              {/* <Sparkles className="w-12 h-12 text-primary-foreground/80 mx-auto" /> */}
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-extralight text-gray-800 mb-4 tracking-tight">
              Begin Your Transformative
              <span className="block font-light text-primary-foreground/80 mt-2">Journey</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <motion.button 
              onClick={() => navigate('/services')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-primary-foreground text-primary px-12 py-5 rounded-full font-light text-xl hover:bg-background transition-all duration-300 shadow-2xl hover:shadow-primary-foreground/50 tracking-wide flex items-center gap-3 relative overflow-hidden"
            >
              <span className="relative z-10 cursor-pointer">Reserve Your Session</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 relative z-10" />
              </motion.div>
              
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-6 text-primary-foreground/90"
            >
              <div className="flex -space-x-3">
                {clientImages.map((image, index) => (
                  <motion.img 
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    src={image} 
                    alt={`Client ${index + 1}`} 
                    className="w-12 h-12 rounded-full border-2 border-primary shadow-lg cursor-pointer transition-all duration-300" 
                  />
                ))}
              </div>
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-sm font-light tracking-wide"
              >
                500+ satisfied clients
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
