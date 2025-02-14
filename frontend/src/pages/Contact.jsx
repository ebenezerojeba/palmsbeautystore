import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Loader2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ExternalLink
} from 'lucide-react';


// New Social Media Component
const SocialMedia = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/palmsbeautystore',
      color: 'hover:text-pink-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/palmsbeautystore',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/palmsbeautystore',
      color: 'hover:text-blue-400'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/palmsbeautystore',
      color: 'hover:text-red-600'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Connect With Us</h2>
      <div className="grid grid-cols-2 gap-4">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all ${social.color} group`}
            >
              <Icon className="w-6 h-6 mr-3" />
              <span className="text-gray-600 group-hover:text-gray-900">{social.name}</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>
    </div>
  );
};


const SEO = () => (
  <Helmet>
    <title>Contact Us - PalmsBeautyStore | Beauty Salon in St. John's, NL</title>
    <meta name="description" content="Get in touch with PalmsBeautyStore in St. John's, NL. Book appointments, ask questions, or visit our salon. We're here to help with all your beauty needs." />
    <meta property="og:title" content="Contact PalmsBeautyStore - Book Your Appointment Today" />
    <meta property="og:description" content="Reach out to PalmsBeautyStore in St. John's, NL for appointments and inquiries. Experience exceptional beauty services." />
    <link rel="canonical" href="/contact" />
  </Helmet>
);

const ContactInfo = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Phone className="w-5 h-5 text-pink-600" />
        <span className="text-gray-600">+1 (709) 690-3673</span>
      </div>
      <div className="flex items-center space-x-3">
        <Mail className="w-5 h-5 text-pink-600" />
        <span className="text-gray-600">info@palmsbeautystore.com</span>
      </div>
      <div className="flex items-center space-x-3">
        <MapPin className="w-5 h-5 text-pink-600" />
        <span className="text-gray-600">430 Topsail Road, St. John's, NL A1E 4N1</span>
      </div>
      <div className="flex items-start space-x-3">
        <Clock className="w-5 h-5 text-pink-600" />
        <div className="text-gray-600">
          <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
          <p>Saturday: 10:00 AM - 6:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  </div>
);

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formState.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formState.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service Interest
          </label>
          <select
            id="service"
            name="service"
            value={formState.service}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Select a service</option>
            <option value="hair">Hair Styling</option>
            <option value="natural-hair">Natural Hair Care</option>
            <option value="replacement">Hair Replacement</option>
            <option value="makeup">Makeup Services</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows="4"
            value={formState.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </button>

        {submitStatus === 'success' && (
          <p className="text-green-600 text-center">Message sent successfully!</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-red-600 text-center">Failed to send message. Please try again.</p>
        )}
      </div>
    </form>
  );
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-pink-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-4xl font-bold text-pink-600 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We'd love to hear from you. Connect with us through any of these channels.
        </p>
      </motion.div>

      {/* Main Content with Updated Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <ContactForm />
          </motion.div>

          {/* Right Column: Contact Info & Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <ContactInfo />
            <SocialMedia />
            
            {/* Map */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <iframe
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d345135.8449952276!2d-52.829640250000004!3d47.48263119999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0ca38e6b0aa261%3A0x9e1fd4001f12261f!2sSt.%20John&#39;s%2C%20NL%2C%20Canada!5e0!3m2!1sen!2sng!4v1739569810281!5m2!1sen!2sng" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                alt="Location map" 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;