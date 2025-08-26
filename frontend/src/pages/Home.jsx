import React, { useState, useEffect } from "react";
import { ArrowBigLeft, Calendar, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceCard = ({ title, description, bgColor }) => (
  <div 
    className={`${bgColor} p-6 rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md`}
  >
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const services = [
  {
    title: "Hair Styling",
    description: "Expert cuts, colors, and styling for all hair types",
    bgColor: "bg-amber-50",
  },
  {
    title: "Natural Hair",
    description: "Specialized care for natural hair textures",
    bgColor: "bg-stone-50",
  },
  {
    title: "Hair Replacement",
    description: "Advanced solutions for hair restoration",
    bgColor: "bg-stone-50",
  },
  {
    title: "Makeup",
    description: "Professional makeup for any occasion",
    bgColor: "bg-amber-50",
  },
  {
    title: "Lash Extension",
    description: "Enhance your lashes with expert extensions",
    bgColor: "bg-amber-50",
  },
  {
    title: "Microblading",
    description: "Perfectly shaped brows with semi-permanent microblading",
    bgColor: "bg-stone-50",
  },
];

const AnimatedText = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const headlineWords = ["Transform", "Your", "Look", "at", "PalmsBeauty"];
  const [visibleWords, setVisibleWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const animateWords = async () => {
      setIsLoading(true);
      for (let i = 0; i <= headlineWords.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setVisibleWords(headlineWords.slice(0, i));
      }
      setIsLoading(false);
    };

    animateWords();
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-20 lg:pt-24 lg:pb-28">
          {/* Location Badge */}
          <AnimatedText delay={200}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-8">
              <Star className="h-4 w-4 text-pink-400" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-600">
                St. John's, Newfoundland and Labrador
              </span>
            </div>
          </AnimatedText>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight min-h-[4em] lg:min-h-[3em]"
                aria-label={headlineWords.join(" ")}
              >
                {headlineWords.map((word, index) => (
                  <span key={index} className="inline-block mr-4">
                    <span
                      className={`transition-all duration-500 inline-block
                                ${
                                  visibleWords.includes(word)
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-4"
                                }`}
                    >
                      {word}
                      {word === "PalmsBeauty" && (
                        <span className="absolute bottom-2 left-0 w-full h-3 bg-pink-200/30 -z-10"></span>
                      )}
                    </span>
                  </span>
                ))}
              </h1>

              <AnimatedText delay={1000}>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Experience exceptional beauty services tailored to your unique
                  style. From expert hair care and natural hair solutions to
                  professional makeup artistry, our dedicated team helps you
                  embrace your authentic beauty.
                </p>
              </AnimatedText>

              <AnimatedText delay={1200}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/services"
                    className="group inline-flex items-center justify-center px-6 py-3 
                             bg-pink-900 text-white rounded-lg font-medium 
                             transition-all duration-200 hover:bg-pink-800 shadow-sm"
                  >
                    Book Appointment
                    <Calendar className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/collections"
                    className="group inline-flex items-center justify-center px-6 py-3 
                             border border-gray-300 text-gray-700 rounded-lg font-medium 
                             hover:bg-gray-50 transition-all duration-200"
                  >
                    Shop Products
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimatedText>
            </div>

            {/* Right Column - Service Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, index) => (
                <AnimatedText key={service.title} delay={700 + index * 100}>
                  <ServiceCard {...service} />
                </AnimatedText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;