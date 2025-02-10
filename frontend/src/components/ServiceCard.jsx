import React from "react";
import { useNavigate } from "react-router-dom";
const ServiceCard = ({ id, title, description, price, icon: Icon }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full transition-all duration-300 hover:shadow-xl">
      <div className="text-center mb-4">
        {Icon && <Icon className="w-8 h-8 mx-auto mb-3 text-purple-800" />}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-lg font-medium text-purple-500">
          Starting from ${price}
        </p>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <button
        onClick={() => {
          navigate(`/appointment/${id}`);
          scrollTo(0, 0);
        }}
        className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors cursor-pointer duration-300"
      >
        Book Now
      </button>
    </div>
  );
};

export default ServiceCard;
