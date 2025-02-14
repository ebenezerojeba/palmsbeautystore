import React, { useContext, useEffect } from "react";
import { AdminContext } from "../context/adminContext";
import { X, Check, Loader } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import ActionButton from "../components/ActionButton";

const AllAppointment = () => {
  const {
    appointments,
    getAllAppointments,
    cancelAppointment,
    isCompleted,
    slotDateFormat,
    loadingStates
  } = useContext(AdminContext);

  useEffect(() => {
    getAllAppointments();
  }, []);

  // Loading skeleton for table rows
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="hidden md:grid md:grid-cols-7 p-4 items-center">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="col-span-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loadingStates.appointments) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">All Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Appointments</h2>
        </div>

        <div className="rounded-lg overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid md:grid-cols-7 bg-gray-50 p-4 font-medium text-gray-600">
            <div className="col-span-1">#</div>
            <div className="col-span-1">Customer</div>
            <div className="col-span-1">Services</div>
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-1">Phone</div>
            <div className="col-span-1">Status</div>
          </div>

          {/* Appointments List */}
          <div className="divide-y divide-gray-200 max-h-[80vh] overflow-y-auto">
            {appointments.reverse().map((item, index) => (
              <div
                key={index}
                className="group hover:bg-gray-50 transition-colors"
              >
                {/* Mobile View */}
                <div className="md:hidden p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{item.userDetails?.name}</h3>
                    <StatusBadge item={item} />
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Service: {item.serviceTitle}</p>
                    <p>
                      Date: {slotDateFormat(item.date)} {item.time}
                    </p>
                    <p>Phone: {item.userDetails?.phone}</p>
                  </div>
                  {!item.isCancelled && !item.isCompleted && (
                    <div className="flex gap-2 pt-2">
                      <ActionButton
                      color="border-red-400"
                        icon={loadingStates.cancelOperation ? 
                          <Loader className="animate-spin text-red-500" /> : 
                          <X className="text-red-500" />}
                        onClick={() => cancelAppointment(item._id)}
                        label={loadingStates.cancelOperation ? "Cancelling..." : "Cancel"}
                        disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
                      />
                      <ActionButton
                          color="border-green-500"
                        icon={loadingStates.completeOperation ? 
                          <Loader className="animate-spin text-green-500" /> : 
                          <Check className="text-green-500 border-green-500" />}
                        onClick={() => isCompleted(item._id)}
                        label={loadingStates.completeOperation ? "Completing..." : "Complete"}
                        disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
                      />
                    </div>
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-7 p-4 items-center">
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-1">{item.userDetails?.name}</div>
                  <div className="col-span-1">{item.serviceTitle}</div>
                  <div className="col-span-2">
                    {slotDateFormat(item.date)} {item.time}
                  </div>
                  <div className="col-span-1">{item.userDetails?.phone}</div>
                  <div className="col-span-1">
                    <StatusBadge item={item} />
                    {!item.isCancelled && !item.isCompleted && (
                      <div className="flex gap-2 mt-2">
                        <ActionButton
                        color="border-red-500 border-2"
                          icon={loadingStates.cancelOperation ? 
                            <Loader className="animate-spin text-red-500" /> : 
                            <X className="text-red-500 border-green-500 " />}
                            
                          onClick={() => cancelAppointment(item._id)}
                          label={loadingStates.cancelOperation ? "Cancelling..." : "Cancel"}
                          disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
                        />
                        <ActionButton
                          icon={loadingStates.completeOperation ? 
                            <Loader className="animate-spin text-green-500" /> : 
                            <Check className="text-green-500 border-green-500" />}
                          onClick={() => isCompleted(item._id)}
                          label={loadingStates.completeOperation ? "Completing..." : "Complete"}
                          disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAppointment;