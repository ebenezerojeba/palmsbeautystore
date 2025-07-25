
// import React, { useState } from 'react';
// import {
//   Clock,
//   Calendar,
//   ArrowRight
// } from 'lucide-react';

// const ServiceCard = ({
//   title,
//   description,
//   duration,
//   price,
//   image,
//   isActive = true,
//   onBook,
//   discount = null,
//   originalPrice = null,
//   availability = "Available Today"
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const handleBooking = (e) => {
//     e.stopPropagation();
//     onBook?.();
//   };

//   return (
//     <div
//       className="group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="flex">
//         {/* Image Section */}
//         <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
//           {image ? (
//             <img
//               src={image}
//               alt={title}
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//             />
//           ) : (
//             <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-2xl opacity-50">
//               💅
//             </div>
//           )}
          
//           {/* Discount Badge */}
//           {discount && (
//             <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
//               {discount}% OFF
//             </div>
//           )}
//         </div>

//         {/* Content Section */}
//         <div className="flex-1 p-4 flex flex-col justify-between">
//           {/* Title & Description */}
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-purple-700 transition-colors">
//               {title}
//             </h3>
//             <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
//               {description}
//             </p>
//           </div>

//           {/* Duration & Price */}
//           <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
//             <div className="flex items-center gap-1 text-gray-700 text-sm">
//               <Clock className="w-4 h-4 text-gray-500" />
//               {duration || '45 min'}
//             </div>
//             <div className="flex items-center gap-2">
//               {originalPrice && (
//                 <span className="line-through text-gray-400 text-sm">${originalPrice}</span>
//               )}
//               <span className="text-lg font-bold text-gray-800">
//                 ${price || '85'}
//               </span>
//             </div>
//           </div>

//           {/* Availability */}
//           <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
//             <span className="font-medium">{isActive ? "Available Now" : "Not Available"}</span>
//           </div>

//           {/* Book Button */}
//           <button
//             onClick={handleBooking}
//             className={`mt-3 w-full py-2.5 px-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
//               isHovered
//                 ? 'bg-gray-800 shadow-md'
//                 : 'bg-gray-700'
//             }`}
//           >
//             <Calendar className="w-4 h-4" />
//             Book Now
//             <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
//           </button>
//         </div>
//       </div>

//       {/* Hover Overlay */}
//       <div
//         className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
//           isHovered ? 'bg-gradient-to-r from-purple-50/40 to-transparent' : ''
//         }`}
//       />
//     </div>
//   );
// };

// export default ServiceCard;


import React, { useContext, useState } from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
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
  availability = "Available Today"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const{token} =useContext(AppContext)

  const navigate = useNavigate()

const handleBooking = (e) => {
  e.stopPropagation();

  if (!token) {
    toast.warn("Kindly login to book this service");
    navigate('/login');
    return; // Prevent onBook from being called
  }

  onBook?.(); // Only run if the user is authenticated
};
;

  const hasImage = Boolean(image);

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 ${
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
          <h3 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-purple-700 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Duration & Price */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-700 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            {duration || '45 min'}
          </div>
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="line-through text-gray-400 text-sm">${originalPrice}</span>
            )}
            <span className="text-lg font-bold text-gray-800">
              ${price || '85'}
            </span>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="font-medium">
            {isActive ? "Available Now" : "Not Available"}
          </span>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          className={`mt-3 w-full py-2.5 px-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
            isHovered ? 'bg-gray-800 shadow-md' : 'bg-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Book Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
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
