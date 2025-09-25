// import React, { useState, useEffect, useRef } from "react";
// import { Calendar, ChevronRight, Star, ArrowRight, Phone, Mail, MapPin, Award, Users, Clock, Sparkles, Play, Instagram, Facebook, Shield, Heart, Zap, CheckCircle, X, Menu, Factory, FactoryIcon, Quote, Eye, Scissors, Crown } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";

// const ServiceCard = ({ title, description, image, price, features, icon: Icon, delay }) => (
  
//   <div 
//     className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 border border-neutral-100"
//     style={{ animationDelay: `${delay}ms` }}
//   >
//     <div className="relative overflow-hidden h-64">
//       <img 
//         src={image} 
//         alt={title}
//         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
//       <div className="absolute top-4 left-4">
//         <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
//           <Icon className="h-6 w-6 text-neutral-800" />
//         </div>
//       </div>
//       <div className="absolute top-4 right-4">
//         <div className="bg-white/90 backdrop-blur-sm text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">
//           {price}
//         </div>
//       </div>
//     </div>
    
//     <div className="p-8">
//       <h3 className="text-2xl font-light text-neutral-900 mb-4 tracking-wide">{title}</h3>
//       <p className="text-neutral-600 mb-6 leading-relaxed">{description}</p>
      
//       <div className="space-y-3 mb-8">
//         {features.map((feature, index) => (
//           <div key={index} className="flex items-center gap-3">
//             <div className="w-1 h-1 bg-neutral-400 rounded-full" />
//             <span className="text-sm text-neutral-600">{feature}</span>
//           </div>
//         ))}
//       </div>
      
//       <button
//       onClick={()=> navigate('/services')}
//        className="w-full bg-pink-900 text-white py-3 rounded-xl font-medium hover:bg-pink-800 transition-colors duration-300 flex items-center justify-center gap-2">
//         Book Appointment
      
//       </button>
//     </div>
//   </div>
// );

// const TestimonialCard = ({ name, review, rating, image, service, delay }) => (
//   <div 
//     className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 hover:shadow-lg transition-all duration-500"
//     style={{ animationDelay: `${delay}ms` }}
//   >
//     <div className="flex items-center gap-4 mb-6">
//       <img src={image} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100" />
//       <div>
//         <h4 className="font-medium text-neutral-900 text-lg">{name}</h4>
//         <p className="text-sm text-neutral-500">{service}</p>
//       </div>
//     </div>
    
//     <div className="flex items-center mb-4">
//       {[...Array(rating)].map((_, i) => (
//         <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
//       ))}
//     </div>
    
//     <Quote className="h-8 w-8 text-neutral-200 mb-4" />
//     <p className="text-neutral-700 leading-relaxed italic">{review}</p>
//   </div>
// );

// const BeforeAfterCard = ({ before, after, title, delay }) => {
//   const [isAfter, setIsAfter] = useState(false);
  
//   return (
//     <div 
//       className="relative rounded-2xl overflow-hidden shadow-sm border border-neutral-100 group cursor-pointer"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div 
//         className="relative w-full h-80"
//         onMouseEnter={() => setIsAfter(true)}
//         onMouseLeave={() => setIsAfter(false)}
//       >
//         <img 
//           src={before} 
//           alt="Before"
//           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isAfter ? 'opacity-0' : 'opacity-100'}`}
//         />
//         <img 
//           src={after} 
//           alt="After"
//           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isAfter ? 'opacity-100' : 'opacity-0'}`}
//         />
        
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//         <div className="absolute bottom-6 left-6 text-white">
//           <h3 className="font-light text-lg tracking-wide">{title}</h3>
//           <p className="text-sm opacity-90">{isAfter ? 'After' : 'Before'} • Hover to reveal</p>
//         </div>
//         <div className="absolute top-6 right-6">
//           <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//             <Eye className="h-5 w-5 text-white" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CounterAnimation = ({ end, label, prefix = "", suffix = "" }) => {
//   const [count, setCount] = useState(0);
//   const countRef = useRef(null);
  
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           let start = 0;
//           const increment = end / 60;
//           const timer = setInterval(() => {
//             start += increment;
//             if (start >= end) {
//               setCount(end);
//               clearInterval(timer);
//             } else {
//               setCount(Math.floor(start));
//             }
//           }, 30);
//         }
//       },
//       { threshold: 0.5 }
//     );
    
//     if (countRef.current) observer.observe(countRef.current);
//     return () => observer.disconnect();
//   }, [end]);
  
//   return (
//     <div ref={countRef} className="text-center">
//       <div className="text-4xl font-light text-white mb-2 tracking-wide">
//         {prefix}{count}{suffix}
//       </div>
//       <div className="text-neutral-300 text-sm tracking-wide uppercase">{label}</div>
//     </div>
//   );
// }

// const services = [
//   {
//     title: "Signature Hair Styling",
//     description: "Premium cuts, colors, and styling with luxury organic products. Transform your look with our master stylists.",
//     image: assets.Corn2,
//     price: "From $85",
//     features: ["Personalized consultation", "Premium organic products", "30-day style guarantee"],
//     icon: Scissors
//   },
//   {
//     title: "Natural Hair Mastery",
//     description: "Specialized care for natural textures using the finest chemical-free products. Embrace your authentic beauty.",
//     image: assets.Corn,
//     price: "From $120",
//     features: ["Texture specialist", "Chemical-free treatments", "Custom care plan"],
//     icon: Heart
//   },
//   {
//     title: "Luxury Lash Extensions",
//     description: "Professional extensions that enhance your natural beauty. Wake up effortlessly gorgeous every single day.",
//     image: assets.lash6,
//     price: "From $150",
//     features: ["4-6 week retention", "Cruelty-free materials", "Complimentary touch-up"],
//     icon: Eye
//   }
// ];

// const testimonials = [
//   {
//     name: "Sarah Johnson",
//     review: "An absolutely transformative experience. The attention to detail and artistry is unmatched. I feel like the best version of myself.",
//     rating: 5,
//     image: assets.headshot1,
//     service: "Hair Styling"
//   },
//   {
//     name: "Michelle Thompson",
//     review: "The lash extensions are pure perfection. The quality and technique are exceptional. I receive compliments everywhere I go.",
//     rating: 5,
//     image: assets.headshot2,
//     service: "Lash Extensions"
//   },
//   {
//     name: "Ashley Williams",
//     review: "PalmsBeauty didn't just change my look - they transformed my confidence. The team's expertise and care is extraordinary.",
//     rating: 5,
//     image: assets.headshot3,
//     service: "Natural Hair Care"
//   }
// ];

// const Home = () => {
//   const [scrollY, setScrollY] = useState(0);
//   const navigate = useNavigate()

//   useEffect(() => {
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="relative min-h-screen bg-neutral-50 overflow-hidden flex items-center">
//         {/* Subtle background elements */}
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neutral-400 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neutral-500 rounded-full blur-3xl"></div>
//         </div>

//         <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             {/* Left Column */}
//             <div className="text-center lg:text-left">
//               <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white shadow-sm border border-neutral-200 mb-12">
//                 <MapPin className="h-4 w-4 text-neutral-600" />
//                 <span className="text-sm font-light tracking-wide text-neutral-600">St. John, Newfoundland</span>
//               </div>

//               <h1 className="text-5xl md:text-6xl font-extralight text-neutral-900 mb-8 leading-[0.9] tracking-tight">
//                 Timeless
//                 <span className="block font-light text-neutral-700">
//                   Elegance
//                 </span>
//               </h1>

//               <p className="text-xl text-neutral-600 mb-12 leading-relaxed max-w-lg font-light">
//                  Experience personalized beauty services 
//                 that enhance your natural radiance in our serene St. John's sanctuary.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-16">
//                 <button 
//                 onClick={()=> navigate('/services')}
//                   className="bg-pink-900 text-white px-12 py-4 rounded-full font-light text-lg hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide flex items-center justify-center gap-3"
//                 >

//                   Book Experience
//                 </button>
//                 <button
//                 onClick={()=> navigate('/collections')}
//                  className="border border-pink-900 text-neutral-700 px-12 py-4 rounded-full font-light hover:bg-neutral-50 transition-all duration-300 tracking-wide">
//                   Shop Products
//                 </button>
//               </div>

//               {/* Elegant Stats */}
//               <div className="grid grid-cols-3 gap-12 text-center lg:text-left">
//                 <div>
//                   <div className="text-3xl font-light text-neutral-900 mb-1">500+</div>
//                   <div className="text-sm text-neutral-500 uppercase tracking-widest">Happy Clients</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-light text-neutral-900 mb-1">8+</div>
//                   <div className="text-sm text-neutral-500 uppercase tracking-widest">Years Experience</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-light text-neutral-900 mb-1">4.9</div>
//                   <div className="text-sm text-neutral-500 uppercase tracking-widest">Star Rating</div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="relative">
//               <div className="relative">
//                 <img 
//                   src={assets.hair1}
//                   alt="Luxury beauty salon experience"
//                   className="w-full md:h-[700px] h-[350px] object-cover rounded-2xl shadow-2xl"
//                   style={{
//                     transform: `translateY(${scrollY * 0.05}px)`,
//                   }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
//               </div>
    
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section id="services" className="py-32 bg-white">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="text-center mb-24">
//             <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-neutral-50 border border-neutral-200 mb-8">
//               <Sparkles className="h-4 w-4 text-neutral-600" />
//               <span className="text-sm font-light tracking-wide text-neutral-600">Signature Services</span>
//             </div>
//             <h2 className="text-5xl md:text-7xl font-extralight text-neutral-900 mb-8 tracking-tight">
//               Artistry in
//               <span className="block font-light text-neutral-700">Motion</span>
//             </h2>
         
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
//             {services.map((service, index) => (
//               <ServiceCard key={service.title} {...service} delay={index * 100} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Before/After Portfolio */}
//       <section id="portfolio" className="py-32 bg-neutral-50">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="text-center mb-24">
//             <h2 className="text-5xl md:text-7xl font-extralight text-neutral-900 mb-8 tracking-tight">
//               Transformative
//               <span className="block font-light text-neutral-700">Artistry</span>
//             </h2>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
//             <BeforeAfterCard 
//               before={assets.before1}
//               after={assets.braids2}
//               title="Color Transformation"
//               delay={0}
//             />
//             <BeforeAfterCard 
//               before={assets.naturalafter}
//               after={assets.stitches}
//               title="Natural Hair Styling"
//               delay={100}
//             />
//             <BeforeAfterCard 
//               before={assets.beforelash}
//               after={assets.lash6}
//               title="Lash Enhancement"
//               delay={200}
//             />
//           </div>

//           <div className="text-center">
//             <button onClick={()=>navigate('/about')} className="bg-pink-900 text-white px-12 py-4 rounded-full font-light text-lg hover:bg-neutral-800 transition-colors shadow-lg tracking-wide">
//               View Complete Portfolio
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section id="testimonials" className="py-32 bg-white">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="text-center mb-24">
//             <h2 className="text-5xl md:text-7xl font-extralight text-neutral-900 mb-8 tracking-tight">
//               Client
//               <span className="block font-light text-neutral-700">Experiences</span>
//             </h2>
//             <p className="text-xl text-neutral-600 font-light">
//               Stories of transformation and confidence from our valued clients
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <TestimonialCard key={testimonial.name} {...testimonial} delay={index * 100} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Refined CTA Section */}
//       <section className="py-16 bg-pink-900 relative overflow-hidden">
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neutral-300 rounded-full blur-3xl"></div>
//         </div>
        
//         <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
//           <h2 className="text-4xl md:text-6xl font-extralight text-white mb-8 tracking-tight">
//             Begin Your Transformative
//             <span className="block font-light text-neutral-300">Journey</span>
//           </h2>
//           <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
//             <button 
//             onClick={()=> navigate('/services')}
//               className="bg-white text-pink-900 px-12 py-5 rounded-full font-light text-xl hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide flex items-center gap-3"
//             >
             
//               Reserve Your Session
//             </button>
//             <div className="flex items-center gap-6 text-neutral-300">
//               <div className="flex -space-x-3">
//                 <img src={assets.headshot1} alt="Client" className="w-10 h-10 rounded-full border-2 border-neutral-600" />
//                 <img src={assets.headshot2} alt="Client" className="w-10 h-10 rounded-full border-2 border-neutral-600" />
//                 <img src={assets.headshot3} alt="Client" className="w-10 h-10 rounded-full border-2 border-neutral-600" />
//               </div>
//               <span className="text-sm font-light tracking-wide">500+ satisfied clients</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Custom Styles */}
//       <style jsx>{`
      
        
//         .font-extralight {
//           font-weight: 300;
//         }
        
//         .tracking-tight {
//           letter-spacing: -0.02em;
//         }
        
//         .tracking-wide {
//           letter-spacing: 0.02em;
//         }
        
//         .tracking-wider {
//           letter-spacing: 0.05em;
//         }
        
//         .tracking-widest {
//           letter-spacing: 0.1em;
//         }
        
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(40px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in-up {
//           animation: fade-in-up 0.8s ease-out forwards;
//         }
        
//         /* Smooth scroll behavior */
//         html {
//           scroll-behavior: smooth;
//         }
        
//         /* Custom scrollbar */
//         ::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: #c1c1c1;
//           border-radius: 3px;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: #a1a1a1;
//         }
        
//         /* Enhanced focus states */
//         button:focus,
//         input:focus,
//         select:focus {
//           outline: none;
//           ring: 2px;
//           ring-color: rgb(38 38 38);
//         }
        
//         /* Elegant hover transitions */
//         .group:hover .group-hover\\:scale-105 {
//           transform: scale(1.05);
//         }
        
//         .group:hover .group-hover\\:scale-110 {
//           transform: scale(1.1);
//         }
        
//         /* Backdrop blur support */
//         .backdrop-blur-sm {
//           backdrop-filter: blur(4px);
//         }
        
//         .backdrop-blur-md {
//           backdrop-filter: blur(12px);
//         }
        
//         /* Shadow variations */
//         .shadow-3xl {
//           box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
//         }
//       `}</style>
//     </div>
//   );
// }

// export default Home;












import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronRight, Star, ArrowRight, Phone, Mail, MapPin, Award, Users, Clock, Sparkles, Play, Instagram, Facebook, Shield, Heart, Zap, CheckCircle, X, Menu, Factory, Quote, Eye, Scissors, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ServiceCard from "../components/HeroServiceCard";

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-neutral-50 overflow-hidden flex items-center">
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neutral-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neutral-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white shadow-sm border border-neutral-200 mb-12">
                <MapPin className="h-4 w-4 text-neutral-600" />
                <span className="text-sm font-light tracking-wide text-neutral-600">St. John, Newfoundland</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extralight text-neutral-900 mb-8 leading-[0.9] tracking-tight">
                Timeless
                <span className="block font-light text-neutral-700">
                  Elegance
                </span>
              </h1>

              <p className="text-xl text-neutral-600 mb-12 leading-relaxed max-w-lg font-light">
                 Experience personalized beauty services 
                that enhance your natural radiance in our sanctuary.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-16">
                <button 
                onClick={()=> navigate('/services')}
                  className="bg-pink-900 text-white px-12 py-4 rounded-full font-light text-lg hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide flex items-center justify-center gap-3"
                >

                  Book Experience
                </button>
                <button
                onClick={()=> navigate('/collections')}
                 className="border border-pink-900 text-neutral-700 px-12 py-4 rounded-full font-light hover:bg-neutral-50 transition-all duration-300 tracking-wide">
                  Shop Products
                </button>
              </div>

              {/* Elegant Stats with Counter Animation */}
              <div className="grid grid-cols-3 gap-12 text-center lg:text-left">
                <CounterAnimation end={500} suffix="+" label="Happy Clients" />
                <CounterAnimation end={8} suffix="+" label="Years Experience" />
                <CounterAnimation end={4.9} label="Star Rating" />
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              <div className="relative">
                <img 
                  src={assets.hair1}
                  alt="Luxury beauty salon experience"
                  className="w-full md:h-[700px] h-[350px] object-cover rounded-2xl shadow-2xl"
                  style={{
                    transform: `translateY(${scrollY * 0.05}px)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
              </div>
    
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Reduced padding */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-neutral-50 border border-neutral-200 mb-8">
              <span className="text-sm font-light tracking-wide text-neutral-600">Signature Services</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extralight text-neutral-900 mb-8 tracking-tight">
              Artistry in
              <span className="block font-light text-neutral-700">Motion</span>
            </h2>
         
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Portfolio - Reduced padding */}
      <section id="portfolio" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-extralight text-neutral-900 mb-8 tracking-tight">
              Transformative
              <span className="block font-light text-neutral-700">Artistry</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <BeforeAfterCard 
              before={assets.before1}
              after={assets.braids2}
              title="Color Transformation"
              delay={0}
            />
            <BeforeAfterCard 
              before={assets.naturalafter}
              after={assets.stitches}
              title="Natural Hair Styling"
              delay={100}
            />
            <BeforeAfterCard 
              before={assets.beforelash}
              after={assets.lash6}
              title="Lash Enhancement"
              delay={200}
            />
          </div>

          <div className="text-center">
            <button onClick={()=>navigate('/about')} className="bg-pink-900 text-white px-12 py-4 rounded-full font-light text-lg hover:bg-neutral-800 transition-colors shadow-lg tracking-wide">
              View Complete Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials - Reduced padding */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-extralight text-neutral-900 mb-8 tracking-tight">
              Client
              <span className="block font-light text-neutral-700">Experiences</span>
            </h2>
            <p className="text-xl text-neutral-600 font-light">
              Stories of transformation and confidence from our valued clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} {...testimonial} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Refined CTA Section */}
      <section className="py-16 bg-pink-900 relative overflow-hidden border rounded-3xl">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neutral-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-extralight text-white mb-8 tracking-tight">
            Begin Your Transformative
            <span className="block font-light text-neutral-300">Journey</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <button 
            onClick={()=> navigate('/services')}
              className="bg-white text-pink-900 px-12 py-5 rounded-full font-light text-xl hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide flex items-center gap-3"
            >
             
              Reserve Your Session
            </button>
            <div className="flex items-center gap-6 text-neutral-300">
              <div className="flex -space-x-3">
                <img src={assets.headshot1} alt="Client" className="w-10 h-10 rounded-full border-2 border-neutral-600" />
                <img src={assets.headshot2} alt="Client" className="w-10 h-10 rounded-full border-2 border-neutral-600" />
                <img src={assets.headshot3} alt="Client" className="w-10 h-10 rounded-full border-2 border-neutral-600" />
              </div>
              <span className="text-sm font-light tracking-wide">500+ satisfied clients</span>
            </div>
          </div>
        </div>
      </section>

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