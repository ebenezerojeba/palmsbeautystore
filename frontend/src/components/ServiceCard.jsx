// import { Clock, DollarSign, Info, Loader2 } from 'lucide-react';
// import { useState } from 'react';
// import {motion }from 'framer-motion'
// import {useNavigate} from "react-router-dom"

// const ServiceCard = ({ title, description, duration, price, image, id }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const navigate = useNavigate()
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-lg shadow-md overflow-hidden"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={image || "/api/placeholder/400/300"}
//           alt={title}
//           className={`w-full h-full object-cover transition-transform duration-300 ${
//             isHovered ? 'scale-110' : 'scale-100'
//           }`}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//       </div>

//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
//         <p className="text-gray-600 mb-4">{description}</p>
        
//         <div className="space-y-2">
//           <div className="flex items-center text-gray-600">
//             <Clock className="w-4 h-4 mr-2" />
//             <span>{duration}</span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <DollarSign className="w-4 h-4 mr-2" />
//             <span>{price}</span>
//           </div>
//         </div>

        
        
//     <button
//      onClick={() => {
//       navigate(`/appointment/${id}`);
//       scrollTo(0, 0);
//     }}
//         className="mt-4 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
//           Book Now
//         </button>
//       </div>
//     </motion.div>
//   );

// };

// export default ServiceCard




// ServiceCard.jsx - Updated component
// import { Clock, DollarSign, Info, Loader2 } from 'lucide-react';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from "react-router-dom";

// const ServiceCard = ({ title, description, duration, price, image, id, isActive = true }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const navigate = useNavigate();

//   // Don't render if service is not active
//   if (!isActive) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-lg shadow-md overflow-hidden"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={image || "/api/placeholder/400/300"}
//           alt={title}
//           className={`w-full h-full object-cover transition-transform duration-300 ${
//             isHovered ? 'scale-110' : 'scale-100'
//           }`}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//       </div>

//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
//         <p className="text-gray-600 mb-4">{description}</p>
        
//         <div className="space-y-2">
//           <div className="flex items-center text-gray-600">
//             <Clock className="w-4 h-4 mr-2" />
//             <span>{duration}</span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <DollarSign className="w-4 h-4 mr-2" />
//             <span>{price}</span>
//           </div>
//         </div>

//         <button
//           onClick={() => {
//             navigate(`/appointment/${id}`);
//             scrollTo(0, 0);
//           }}
//           className="mt-4 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
//         >
//           Book Now
//         </button>
//       </div>
//     </motion.div>
//   );
// };
// export default ServiceCard;




import React from 'react';
import { Clock, DollarSign } from 'lucide-react';

const ServiceCard = ({ title, description, duration, price, image, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

        <div className="flex items-center justify-between text-sm mt-2">
          <span className="flex items-center gap-1 text-gray-700">
            <Clock className="w-4 h-4" />
            {duration || '—'}
          </span>
          <span className="flex items-center gap-1 text-gray-700">
            <DollarSign className="w-4 h-4" />
            {price || '—'}
          </span>
        </div>

        <button
          onClick={onBook}
          className="w-full mt-4 bg-pink-600 text-white text-sm py-2 rounded-md hover:bg-pink-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
