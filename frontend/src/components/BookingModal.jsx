import React from 'react';

const BookingModal = ({ isOpen, onClose, bookingDetails, onDownloadCalendar }) => {
  if (!isOpen || !bookingDetails) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl">
        {/* Success Icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-8 px-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Booking Confirmed!
          </h2>

          {/* Service Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {bookingDetails.serviceTitle}
            </h3>
            <div className="text-sm text-gray-500 mb-4">
              Booking ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-800">
                  {formatDate(bookingDetails.date)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Time</span>
                <span className="font-medium text-gray-800">
                  {bookingDetails.time}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-800">
                  ₦{bookingDetails.price?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Customer Details
            </h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-24 text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">
                  {bookingDetails.userDetails.name}
                </span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">Email:</span>
                <span className="font-medium text-gray-800">
                  {bookingDetails.userDetails.email}
                </span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">Phone:</span>
                <span className="font-medium text-gray-800">
                  {bookingDetails.userDetails.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your inbox
            </p>
            <div className="space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onDownloadCalendar}
                className="px-6 cursor-pointer py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className='cursor-pointer'>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;