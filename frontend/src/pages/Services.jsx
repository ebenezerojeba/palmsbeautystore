import { assets, beautyServices, braidingServices } from "../assets/assets";
import ServiceCard from "../components/ServiceCard";
import SectionTitle from "../components/SectionTitle";
const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-purple-900 relative text-white py-20 px-4">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 sm:border-4 border-purple-800 lg:hidden"
          autoPlay
          loop
          muted
          playsInline
          src={assets.bg_video}
        ></video>
        {/* <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Palms Beauty Services</h1>
          <p className="text-xl text-purple-200">Elevate Your Beauty with Our Expert Services</p>
        </div> */}
        {/* Content Overlay */}
        <div className="relative z-10 bg-transparent bg-opacity-50 text-white py-20 px-4 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Palms Beauty Services
            </h1>
            <p className="text-xl text-purple-200">
              Elevate Your Beauty with Our Expert Services
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Services Navigation */}
        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="#hair"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Hair & Braiding
          </a>
          <a
            href="#beauty"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Beauty Services
          </a>
        </div>

        {/* Hair & Braiding Section */}
        <section id="hair" className="mb-20">
          <SectionTitle>Hair & Braiding</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {braidingServices.map((service, index) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>

        {/* Beauty Services Section */}
        <section id="beauty">
          <SectionTitle>Beauty Services</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beautyServices.map((service, index) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-purple-200">Ready to transform your look?</p>
          <button className="mt-4 bg-white text-purple-900 py-2 px-6 rounded-md hover:bg-purple-100 transition-colors duration-300">
            Book Your Appointment
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Services;
