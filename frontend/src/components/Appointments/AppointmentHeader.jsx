import { ChevronLeft } from "lucide-react";

const AppointmentHeader = ({ navigate }) => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Book Appointment</h1>
        <div></div>
      </div>
    </div>
  </div>
);
export default AppointmentHeader;