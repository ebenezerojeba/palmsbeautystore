import React from 'react';
import { ChevronDown, Calendar, X } from 'lucide-react';

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
    // Overlay with blur effect
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Modal container with max-width constraints for different screens */}
      <div className="relative w-full max-w-[90%] sm:max-w-[440px] bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" 
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
        <div className="pt-14 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
            Booking Confirmed!
          </h2>

          {/* Service Details Card */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              {bookingDetails.serviceTitle}
            </h3>
            <div className="text-xs sm:text-sm text-gray-500 mb-4">
              Booking ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {[
                { label: 'Date', value: formatDate(bookingDetails.date) },
                { label: 'Time', value: bookingDetails.time },
                { label: 'Duration', value: bookingDetails.duration },
                { label: 'Amount', value: bookingDetails.price?.toLocaleString() }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Customer Details
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Name', value: bookingDetails.userDetails.name },
                { label: 'Email', value: bookingDetails.userDetails.email },
                { label: 'Phone', value: bookingDetails.userDetails.phone }
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm text-gray-600 sm:w-24">{label}:</span>
                  <span className="text-sm font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <p className="text-xs sm:text-sm text-gray-500">
              A confirmation email has been sent to your inbox
            </p>
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onDownloadCalendar}
                className="w-full sm:w-auto px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;