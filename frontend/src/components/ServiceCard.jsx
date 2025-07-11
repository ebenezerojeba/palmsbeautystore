import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  ArrowRight
} from 'lucide-react';

const ServiceCard = ({
  title,
  description,
  duration,
  price,
  image,
  isActive = true,
  onBook,
  discount = null,
  originalPrice = null,
  availability = "Available Today"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBooking = (e) => {
    e.stopPropagation();
    onBook?.();
  };

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >


      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-6xl opacity-30">
            💅
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute bottom-4 left-4 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 leading-snug group-hover:text-purple-700 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Duration & Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
          <div className="flex items-center gap-1 text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            {duration || '45 min'}
          </div>
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="line-through text-gray-400">${originalPrice}</span>
            )}
            <span className="text-lg font-bold text-gray-600">
              ${price || '85'}
            </span>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-green-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          {/* <span className="font-medium">{availability}</span> */}
          <span className="font-medium">{isActive ? "Available Now" : "Not Avaialble"}</span>
        </div>

        

        {/* Book Button */}
        <button
          onClick={handleBooking}
          className={`mt-2 w-full py-3 px-4 rounded-xl cursor-pointer font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
            isHovered
              ? 'bg-gray-800'
              : 'bg-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Book Appointment
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          isHovered ? 'bg-gradient-to-t from-purple-50/60 to-transparent' : ''
        }`}
      />
    </div>
  );
};

export default ServiceCard;
