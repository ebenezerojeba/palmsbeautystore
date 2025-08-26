import React, { useContext, useState } from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

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
  categoryId,
  serviceId,
  availability = "Available Today"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { token } = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return '0m';

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs && mins) return `${hrs}h ${mins}m`;
    if (hrs) return `${hrs}h`;
    return `${mins}m`;
  };

  const handleBooking = (e) => {
    e.stopPropagation();

    if (!token) {
      toast.warn("Kindly login to book this service");
      
      // Create URL parameters for mobile compatibility
      const appointmentUrl = `/appointment/${serviceId}`;
      const loginUrl = `/login?redirect=${encodeURIComponent(appointmentUrl)}`;
      
      // Add additional parameters if needed
      const urlParams = new URLSearchParams();
      urlParams.set('redirect', appointmentUrl);
      
      if (categoryId) {
        urlParams.set('category', categoryId);
      }
      if (serviceId) {
        urlParams.set('service', serviceId);
      }
      urlParams.set('scroll', window.scrollY.toString());

      // Use both URL parameters AND state for maximum compatibility
      navigate(`/login?${urlParams.toString()}`, {
        state: {
          from: appointmentUrl,
          category: categoryId,
          service: serviceId,
          scrollY: window.scrollY,
        },
      });

      return;
    }

    // If user is authenticated, proceed with booking
    onBook?.();
  };

  const hasImage = Boolean(image);

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 ${
        hasImage ? 'flex flex-row sm:flex-col' : 'flex flex-col'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      {hasImage && (
        <div className="relative w-32 h-32 sm:w-full sm:h-56 flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
              {discount}% OFF
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Title & Description */}
        <div className="space-y-2">
<h3 className="font-semibold text-gray-900 leading-tight text-base sm:text-lg">
  {title}
</h3>

<p className="text-gray-600 leading-relaxed line-clamp-2">
  {description}
</p>

<div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm">
  <Clock className="w-4 h-4 text-gray-500" />
  {formatDuration(duration)}
</div>

{originalPrice && (
  <span className="line-through text-gray-400 text-xs sm:text-sm">
    ${originalPrice}
  </span>
)}

<span className="font-bold text-gray-800 text-sm sm:text-base">
  ${price || '85'}
</span>

<div className='flex justify-end'>
  <button
  onClick={handleBooking}
  className={`mt-2 py-2 px-3 cursor-pointer font-medium text-white transition-all duration-300 flex items-center justify-center group/btn text-xs sm:text-sm ${
    isHovered ? 'bg-pink-500 shadow-md' : 'bg-pink-900'
  }`}
>
  Book Now
</button>
</div>

     </div>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
          isHovered ? 'bg-gradient-to-r from-purple-50/40 to-transparent' : ''
        }`}
      />
    </div>
  );
};

export default ServiceCard;