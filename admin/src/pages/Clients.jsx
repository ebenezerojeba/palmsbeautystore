import React from 'react';
import { Users, Timer } from 'lucide-react';

const Clients = () => {
  return (
    <div className="w-full p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <Users className="w-16 h-16 text-purple-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Client Management Coming Soon
        </h1>
        
       
        <div className="text-sm text-gray-500">
          <p>Currently in development | Check back soon</p>
          {/* <p className="mt-2">Need assistance? Contact your system administrator</p> */}
        </div>
      </div>
    </div>
  );
};

export default Clients