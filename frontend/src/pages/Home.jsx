import React, { useState, useEffect } from "react";
import { Calendar, ChevronRight, Star } from "lucide-react";

const Home = () => {
  const headlineWords = ["Transform", "Your", "Look", "at", "PalmsBeauty"];
  const [visibleWords, setVisibleWords] = useState([]);

  useEffect(() => {
    const animateWords = async () => {
      for (let i = 0; i <= headlineWords.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setVisibleWords(headlineWords.slice(0, i));
      }
    };

    animateWords();
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-neutral-50 to-white">
      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-20 lg:pt-24 lg:pb-28">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-8">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-gray-600">
              St. John's, Newfoundland and Labrador
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight min-h-[4em] lg:min-h-[3em]">
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
                        <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-200/30 -z-10"></span>
                      )}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Experience exceptional beauty services tailored to your unique
                style. From expert hair care and natural hair solutions to
                professional makeup artistry, our dedicated team helps you
                embrace your authentic beauty.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="group inline-flex items-center justify-center px-6 py-3 
                                 bg-gray-900 text-white rounded-lg font-medium 
                                 transition-all duration-200 hover:bg-gray-800 shadow-sm"
                >
                  Book Your Session
                  <Calendar className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  className="group inline-flex items-center justify-center px-6 py-3 
                                 border border-gray-300 text-gray-700 rounded-lg font-medium 
                                 hover:bg-gray-50 transition-all duration-200"
                >
                  Explore Services
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column - Service Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Hair Styling",
                  description:
                    "Expert cuts, colors, and styling for all hair types",
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
                  description:
                    "Perfectly shaped brows with semi-permanent microblaidng",
                  bgColor: "bg-stone-50",
                },
              ].map((service, index) => (
                <div
                  key={service.title}
                  className={`${service.bgColor} p-6 rounded-xl shadow-sm hover:shadow-md 
                             transition-all duration-200 transform hover:-translate-y-1`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
