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
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl px-2 sm:px-6 lg:px-8 py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="">
            <img 
              src={assets.plog} 
              alt="PalmsBeauty Logo" 
              className="w-36 md:w-34 object-contain cursor-pointer"
            />
            <p className="text-sm leading-relaxed">
              Your premier destination for beauty services in St. John's, 
              Newfoundland and Labrador. Specializing in hair styling, 
              natural hair care, and professional makeup services.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/palms_beauty_store/" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <NavLink to="/" onClick={()=> scrollTo(0,0)} className="hover:text-white transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" onClick={()=> scrollTo(0,0)} className="hover:text-white transition-colors">
                  Our Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={()=> scrollTo(0,0)} className="hover:text-white transition-colors">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={()=> scrollTo(0,0)} className="hover:text-white transition-colors">
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/services"
                onClick={()=> scrollTo(0,0)}
                 className="hover:text-white transition-colors">
                  Book Appointment
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Our Services</h3>
            <ul className="space-y-4">
              <li>Hair Styling</li>
              <li>Natural Hair Care</li>
              <li>Hair Replacement</li>
              <li>Makeup Services</li>
              <li>Hair Extensions</li>
              <li>Bridal Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPin size={20} />
                <span>430 Topsail Road, St. John's, CA-NL A1E 4N1</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  (709) 690-3673
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} />
                <a href="mailto:info@palmsbeauty.com" className="hover:text-white transition-colors">
                  info@palmsbeauty.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={20} />
                <div>
                  <p>Mon-Fri: 9:00 AM - 7:00 PM</p>
                  <p>Sat: 10:00 AM - 6:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm">
              © {currentYear} PalmsBeauty. All rights reserved.
            </div>
    
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;