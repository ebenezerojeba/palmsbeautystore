import { CheckCircle } from "lucide-react";

const PaymentModal = ({
  showPayment,
  setShowPayment,
  selectedDate,
  selectedTime,
  selectedServices,
  formatDate,
  formatNaira,
  getTotalPrice,
  handlePayment
}) => {
  if (!showPayment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            You are almost there!
          </h3>
          <p className="text-gray-600 mb-6">
            Complete payment to confirm your booking
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium text-gray-900 mb-2">
              {formatDate(selectedDate)} at {selectedTime}
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              {selectedServices.map((service) => (
                <p key={service._id}>• {service.title}</p>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatNaira(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors mb-4"
          >
            Pay Now - {formatNaira(getTotalPrice())}
          </button>

          <button
            onClick={() => setShowPayment(false)}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
