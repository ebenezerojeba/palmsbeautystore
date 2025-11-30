import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronRight, Star, ArrowRight, Phone, Mail, MapPin, Award, Users, Clock, Sparkles, Play, Instagram, Facebook, Shield, Heart, Zap, CheckCircle, X, Menu, Factory, Quote, Eye, Scissors, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ServiceCard from "../components/HeroServiceCard";
import HeroSection from "../components/HeroSection";
import GallerySection from "../components/GallerySection";
import TestimonialsSection from "../components/TestimonialSection";
import CTASection from "../components/CTASection";

const TestimonialCard = ({ name, review, rating, image, service, delay }) => (
  <div 
    className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 hover:shadow-lg transition-all duration-500"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-4 mb-6">
      <img src={image} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100" />
      <div>
        <h4 className="font-medium text-neutral-900 text-lg">{name}</h4>
        <p className="text-sm text-neutral-500">{service}</p>
      </div>
    </div>
    
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
      ))}
    </div>
    
    <Quote className="h-8 w-8 text-neutral-200 mb-4" />
    <p className="text-neutral-700 leading-relaxed italic">{review}</p>
  </div>
);

const BeforeAfterCard = ({ before, after, title, delay }) => {
  const [isAfter, setIsAfter] = useState(false);
  
  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-sm border border-neutral-100 group cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div 
        className="relative w-full h-80"
        onMouseEnter={() => setIsAfter(true)}
        onMouseLeave={() => setIsAfter(false)}
      >
        <img 
          src={before} 
          alt="Before"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isAfter ? 'opacity-0' : 'opacity-100'}`}
        />
        <img 
          src={after} 
          alt="After"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isAfter ? 'opacity-100' : 'opacity-0'}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="font-light text-lg tracking-wide">{title}</h3>
          <p className="text-sm opacity-90">{isAfter ? 'After' : 'Before'} • Hover to reveal</p>
        </div>
        <div className="absolute top-6 right-6">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CounterAnimation = ({ end, label, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / 50;
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 40);
        }
      },
      { threshold: 0.5 }
    );
    
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);
  
  return (
    <div ref={countRef}>
      <div className="text-3xl font-light text-neutral-900 mb-1">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-neutral-500 uppercase tracking-widest">{label}</div>
    </div>
  );
};

const services = [
  {
    title: "Signature Hair Styling",
    description: "Premium cuts, colors, and styling with luxury organic products. Transform your look with our master stylists.",
    image: assets.Corn2,
    price: "From $85",
    features: ["Personalized consultation", "Premium organic products", "30-day style guarantee"],
    icon: Scissors
  },
  {
    title: "Natural Hair Mastery",
    description: "Specialized care for natural textures using the finest chemical-free products. Embrace your authentic beauty.",
    image: assets.Corn,
    price: "From $120",
    features: ["Texture specialist", "Chemical-free treatments", "Custom care plan"],
    icon: Heart
  },
  {
    title: "Luxury Lash Extensions",
    description: "Professional extensions that enhance your natural beauty. Wake up effortlessly gorgeous every single day.",
    image: assets.lash6,
    price: "From $150",
    features: ["4-6 week retention", "Cruelty-free materials", "Complimentary touch-up"],
    icon: Eye
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    review: "An absolutely transformative experience. The attention to detail and artistry is unmatched. I feel like the best version of myself.",
    rating: 5,
    image: assets.headshot1,
    service: "Hair Styling"
  },
  {
    name: "Michelle Thompson",
    review: "The lash extensions are pure perfection. The quality and technique are exceptional. I receive compliments everywhere I go.",
    rating: 5,
    image: assets.headshot2,
    service: "Lash Extensions"
  },
  {
    name: "Ashley Williams",
    review: "PalmsBeauty didn't just change my look - they transformed my confidence. The team's expertise and care is extraordinary.",
    rating: 5,
    image: assets.headshot3,
    service: "Natural Hair Care"
  },
  {
    name: "Nicole Davis",
    review: "From start to finish, my experience was flawless. The stylists are true artists and the products used made my hair feel healthier than ever.",
    rating: 5,
    image: assets.headshot1,
    service: "Natural Hair Care"
  },
  {
    name: "Emily Brown",
    review: "I can't recommend PalmsBeauty enough. The lash extensions are stunning and so natural-looking. The entire process was comfortable and professional.",
    rating: 5,
    image: assets.headshot2,
    service: "Hair Styling"
  }
];

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
    // In your component:
const galleryImages = [
  {
    before: assets.before1,
    after: assets.braids2,
    title: "Color Transformation"
  },
  {
    before: assets.naturalafter,
    after: assets.stitches,
    title: "Natural Hair Styling"
  },
  {
    before: assets.beforelash,
    after: assets.lash6,
    title: "Lash Enhancement"
  }
];

  return (
    <div className="min-h-screen bg-white">
          <HeroSection heroImage={assets.back2} />
<GallerySection
  images={galleryImages}
  title="Before & After Gallery"
  ctaText="View More"
  onCtaClick={() => navigate('/about')}
/>

<TestimonialsSection testimonials={testimonials} />
    
  

     <CTASection
  navigate={navigate} 
  clientImages={[assets.headshot1, assets.headshot2, assets.headshot3]} 
/>

      {/* Custom Styles */}
      <style jsx>{`
      
        
        .font-extralight {
          font-weight: 300;
        }
        
        .tracking-tight {
          letter-spacing: -0.02em;
        }
        
        .tracking-wide {
          letter-spacing: 0.02em;
        }
        
        .tracking-wider {
          letter-spacing: 0.05em;
        }
        
        .tracking-widest {
          letter-spacing: 0.1em;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Enhanced focus states */
        button:focus,
        input:focus,
        select:focus {
          outline: none;
          ring: 2px;
          ring-color: rgb(38 38 38);
        }
        
        /* Elegant hover transitions */
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
        
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        
        /* Backdrop blur support */
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }
        
        /* Shadow variations */
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}

export default Home;


// import React, { useContext, useEffect, useState } from "react";
// import { assets } from "../assets/assets";
// import { ShopContext } from "../context/ShopContext";
// import ProductItem from "../components/ProductItem";
// import { Loader2 } from "lucide-react";

// const Collection = () => {
//   const { products } = useContext(ShopContext);
//   const [displayProducts, setDisplayProducts] = useState([]);
//   const [loading, setLoading] = useState(true); // loading state

//   useEffect(() => {
//     // Start loading
//     setLoading(true);

//     // Simulate async data update if products come from context
//     const timer = setTimeout(() => {
//       if (!products || products.length === 0) {
//         setDisplayProducts([]);
//         setLoading(false);
//         return;
//       }

//       // Filter out products with no available stock and take first 4
//       const filtered = products
//         .filter(item => {
//           if (!item.variations || item.variations.length === 0) return true;
//           return item.variations.some(v => v.isActive && v.stock > 0);
//         })
//         .slice(0, 4);

//       setDisplayProducts(filtered);
//       setLoading(false);
//     }, 400); // short delay to smooth UI transition

//     return () => clearTimeout(timer);
//   }, [products]);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Banner */}
//       <section className="relative h-[400px] md:h-[500px] bg-neutral-100 overflow-hidden">
//         <img
//           src={
//             assets.hero ||
//             "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200"
//           }
//           alt="New Arrivals"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/30" />
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
//           <h1 className="text-5xl md:text-7xl font-light text-white tracking-wider mb-4 leading-tight">
//             NEW
//             <br />
//             ARRIVALS
//           </h1>
//           <p className="text-white text-base md:text-lg font-light max-w-md">
//             New looks. New Energy. Shop the latest bundle now.
//           </p>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
//           </div> 
//         ) : displayProducts.length === 0 ? (
         
//           <div className="text-center py-16">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <svg
//                 className="w-12 h-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No products available
//             </h3>
//             <p className="text-gray-600">Check back soon for new arrivals</p>
//           </div>
//         )
//          : (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//             {displayProducts.map(item => {
//               const calculatePriceRange = variations => {
//                 if (!variations || variations.length === 0) return null;

//                 const prices = variations
//                   .filter(v => v.isActive && v.stock > 0)
//                   .map(v => v.salePrice || v.price);

//                 if (prices.length === 0) return null;

//                 return {
//                   min: Math.min(...prices),
//                   max: Math.max(...prices)
//                 };
//               };

//               const calculateTotalStock = variations => {
//                 if (!variations || variations.length === 0) return 0;

//                 return variations
//                   .filter(v => v.isActive)
//                   .reduce((total, v) => total + (v.stock || 0), 0);
//               };

//               const priceRange = calculatePriceRange(item.variations);
//               const totalStock = calculateTotalStock(item.variations);

//               return (
//                 <ProductItem
//                   key={item._id}
//                   name={item.name}
//                   id={item._id}
//                   image={item.images || item.image}
//                   variations={item.variations}
//                   basePrice={item.basePrice || item.price}
//                   priceRange={priceRange}
//                   bestSeller={item.bestSeller}
//                   isFeatured={item.isFeatured}
//                   totalStock={totalStock}
//                   averageRating={item.averageRating}
//                   totalReviews={item.totalReviews}
//                   category={item.category}
//                   subCategory={item.subCategory}
//                 />
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Collection;
