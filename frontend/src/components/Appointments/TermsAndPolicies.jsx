// TermsAndPolicies.jsx
import React from "react";

const TermsAndPolicies = ({
  agreeToCancellationPolicy,
  setAgreeToCancellationPolicy,
  onShowCancellationPolicy,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-1 space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-2">
                Cancellation Policy
              </h4>

              <button
                onClick={onShowCancellationPolicy}
                className="text-sm text-gray-800 underline hover:text-gray-900"
              >
                Read full cancellation policy
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agree-cancellation"
              checked={agreeToCancellationPolicy}
              onChange={(e) => setAgreeToCancellationPolicy(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
            />
            <label
              htmlFor="agree-cancellation"
              className="text-sm text-gray-700"
            >
              I understand and agree to the cancellation policy *
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPolicies;
