import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pink-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <img 
              src={assets.plog} 
              alt="PalmsBeauty Logo" 
              className="w-32 sm:w-36 md:w-40 object-contain cursor-pointer mb-4"
            />
            <p className="text-sm leading-relaxed mb-4 sm:mb-6">
              Your premier destination for beauty services in St. John's, 
              Newfoundland and Labrador
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="hover:text-white transition-colors duration-200 p-2 hover:bg-pink-800 rounded-full"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/palms_beauty_store/" 
                className="hover:text-white transition-colors duration-200 p-2 hover:bg-pink-800 rounded-full"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="hover:text-white transition-colors duration-200 p-2 hover:bg-pink-800 rounded-full"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <NavLink 
                  to="/" 
                  onClick={() => window.scrollTo(0, 0)} 
                  className="hover:text-white transition-colors duration-200 text-sm block py-1"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/services" 
                  onClick={() => window.scrollTo(0, 0)} 
                  className="hover:text-white transition-colors duration-200 text-sm block py-1"
                >
                  Our Services
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about" 
                  onClick={() => window.scrollTo(0, 0)} 
                  className="hover:text-white transition-colors duration-200 text-sm block py-1"
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/contact" 
                  onClick={() => window.scrollTo(0, 0)} 
                  className="hover:text-white transition-colors duration-200 text-sm block py-1"
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/services"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors duration-200 text-sm block py-1 font-medium"
                >
                  Book Appointment
                </NavLink>
              </li>
            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">33 Kenmount Rd, St. John's, NL A1B 1W1  </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0" />
                <a 
                  href="tel:+17096903673" 
                  className="hover:text-white transition-colors duration-200 text-sm"
                >
                  (709) 690-3673
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0" />
                <a 
                  href="mailto:info@palmsbeauty.com" 
                  className="hover:text-white transition-colors duration-200 text-sm break-all"
                >
                  Styledbyesther@palmsbeauty.com
                </a>
              </li>
            </ul>
          </div>
        </div>


        {/* Map Section - Full width on mobile */}
        <div className="mt-12 border-t border-pink-800 pt-8">
          <div className="w-full">
            <iframe
              title="PalmsBeauty Location"
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2692.4259456595037!2d-52.752546824723034!3d47.55950039123032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0ca379e19de9a1%3A0x9a5d2c6b1212f317!2s33%20Kenmount%20Rd%2C%20St.%20John&#39;s%2C%20NL%20A1B%201W1%2C%20Canada!5e0!3m2!1sen!2sng!4v1756900778528!5m2!1sen!2sng"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-pink-800 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
            <div className="text-sm mb-4 sm:mb-0">
              © {currentYear} Palmsbeautystore. All rights reserved.
            </div>
          
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;