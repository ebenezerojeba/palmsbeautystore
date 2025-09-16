  // Schedule modal component

import { Loader2, X } from "lucide-react";

// Provider Schedule Modal Component
const ProviderScheduleModal = ({
  providerSchedule,
  selectedProvider,
  setShowProviderSchedule,
  fetchProviderSchedule,
  isLoading
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedProvider?.name}'s Schedule
            </h3>
            <button 
              onClick={() => setShowProviderSchedule(false)} 
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading schedule...</p>
            </div>
          ) : providerSchedule ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Working Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {providerSchedule.workingHours?.map(wh => (
                    <div key={wh.dayOfWeek} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][wh.dayOfWeek]}
                      </span>
                      <span className={wh.isWorking ? "text-green-600" : "text-red-600"}>
                        {wh.isWorking ? `${wh.startTime} - ${wh.endTime}` : 'Not working'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {providerSchedule.breaks?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Scheduled Breaks</h4>
                  <div className="space-y-2">
                    {providerSchedule.breaks.map((breakItem, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{new Date(breakItem.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">{breakItem.startTime} - {breakItem.endTime}</p>
                            {breakItem.reason && <p className="text-sm text-gray-600 mt-1">Reason: {breakItem.reason}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {providerSchedule.vacationDays?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Vacation Days</h4>
                  <div className="space-y-2">
                    {providerSchedule.vacationDays.map((vacation, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}
                            </p>
                            {vacation.reason && <p className="text-sm text-gray-600 mt-1">Reason: {vacation.reason}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No schedule information available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderScheduleModal;