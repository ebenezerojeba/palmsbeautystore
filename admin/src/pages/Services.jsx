import React from 'react';
import { Construction, Clock } from 'lucide-react';

const Services = () => {
  return (
    <div className="w-full p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <Construction className="w-16 h-16 text-blue-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Services Coming Soon
        </h1>
     
   
        <div className="text-sm text-gray-500">
          <p>Currently in development | Check back soon</p>
          {/* <p className="mt-2">Need assistance? Contact your system administrator</p> */}
        </div>
      </div>
    </div>
  );
};

export default Services;