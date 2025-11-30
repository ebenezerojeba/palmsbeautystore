import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const CounterAnimation = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div>
      <div className="text-3xl font-light text-white mb-2">
        {Math.round(count * 10) / 10}{suffix}
      </div>
      <div className="text-sm text-white/80 font-light tracking-wide">{label}</div>
    </div>
  );
};

const HeroSection = ({ heroImage }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="relative md:min-h-[100vh] sm:min-h-[60vh] overflow-hidden flex items-center">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img 
          src={heroImage}
          alt="Luxury beauty salon experience"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Location Badge */}
        {/* <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-12"
        >
          <MapPin className="h-4 w-4 text-white" />
          <span className="text-sm font-light tracking-wide text-white">St. John, Newfoundland</span>
        </motion.div> */}

        {/* Main Heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extralight text-white mb-8 leading-[0.9] tracking-tight"
        >
      
          <span className="block font-light text-white/90 mt-2">
                 {/* Your Beauty Begins Here */}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
        >
       Get personalized hair and beauty services from our trained professionals. Book your appointment today.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
        >
          <button 
            onClick={() => navigate('/services')}
            className="bg-white cursor-pointer text-neutral-900 px-12 py-4 rounded-full font-light text-lg hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 tracking-wide"
          >
            Book Experience
          </button>
          <button
            onClick={() => navigate('/collections')}
            className="border-2 cursor-pointer border-white text-white px-12 py-4 rounded-full font-light hover:bg-white/10 backdrop-blur-sm transition-all duration-300 tracking-wide hover:scale-105"
          >
            Shop Products
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-8 md:gap-16 max-w-3xl mx-auto"
        >
          <CounterAnimation end={500} suffix="+" label="Happy Clients" />
          <CounterAnimation end={8} suffix="+" label="Years Experience" />
          <CounterAnimation end={4.9} label="Star Rating" />
        </motion.div>
      </motion.div>

  
    </section>
  );
};

export default HeroSection;
