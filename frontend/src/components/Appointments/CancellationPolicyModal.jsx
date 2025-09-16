// CancellationPolicyModal.jsx
import { X } from "lucide-react";

const CancellationPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Cancellation Policy
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl shadow-md text-gray-700 text-sm leading-relaxed space-y-4 overflow-y-auto">
        <p>
          We ask that you please reschedule or cancel your appointment 48 hours
          beforehand to enable us to give another client your spot, or you may
          be charged 50% of the price of your appointment.
        </p>

        <p>
          All prices displayed on the website are{" "}
          <span className="font-semibold">taxes included</span> and finalized.
          Add-ons (braiding extensions, wash, or detangling services) will be
          calculated during checkout.
        </p>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Service Cancellation Policy
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <span className="font-semibold">Cancellation by the Customer:</span>{" "}
              Customers may reschedule their service once by providing written
              notice to{" "}
              <a
                href="mailto:Stylebyesther@palmsbeautystore.com"
                className="text-blue-600 underline"
              >
                Stylebyesther@palmsbeautystore.com
              </a>{" "}
              <span className="font-semibold">48 hours</span> before their
              appointment. The notice must include the customer's name, contact
              information, and service details.{" "}
              <span className="font-semibold">Booking fees are not refundable.</span>
            </li>
            <li>
              <span className="font-semibold">Cancellations by Palmsbeautystore:</span>{" "}
              Palmsbeautystore reserves the right to cancel a service in cases
              of non-payment, violation of terms, or breach of agreement. Notice
              will be provided, and refunds will apply only if the service
              provider is unavailable due to unforeseen circumstances.
            </li>
          </ol>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full bg-pink-900 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default CancellationPolicyModal;
