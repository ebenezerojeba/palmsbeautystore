import React, { useEffect, useContext } from "react";
import { Check, Clock, Users, X, Calendar, Mail, Phone } from "lucide-react";
import { AdminContext } from "../context/adminContext";
import { assets } from "../assets/assets";

const Dashboard = () => {
  const {
    dashData,
    getDashData,
    slotDateFormat,
    cancelAppointment,
    isCompleted,
  } = useContext(AdminContext);

  useEffect(() => {
    getDashData();
  }, []);

  const StatCard = ({ icon, value, label, bgColor, textColor }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start space-x-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          {React.cloneElement(icon, {
            className: `${textColor} w-6 h-6`,
          })}
        </div>
        <div>
          <p className={`text-3xl font-bold ${textColor} mb-1`}>{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    dashData && (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Dashboard Overview
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Check />}
              value={dashData.completedAppointments}
              label="Completed Appointments"
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            <StatCard
              icon={<Clock />}
              value={dashData.pendingAppointments}
              label="Pending Appointments"
              bgColor="bg-yellow-100"
              textColor="text-yellow-600"
            />
            <StatCard
              icon={<X />}
              value={dashData.cancelledAppointments}
              label="Cancelled Appointments"
              bgColor="bg-red-100"
              textColor="text-red-600"
            />
            <StatCard
              icon={<Users />}
              value={dashData.totalAppointments}
              label="Total Appointments"
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <div className="flex items-center gap-3 px-6 py-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">Latest Bookings</h2>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {dashData?.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {item.serviceTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {item.userDetails?.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {item.userDetails?.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {item.userDetails?.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {slotDateFormat(item.date)} {slotDateFormat(item.time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 md:mt-0 space-x-4">
                    {item.isCancelled ? (
                      <StatusBadge status="cancelled" />
                    ) : item.isCompleted ? (
                      <StatusBadge status="completed" />
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="p-2 text-red-500 border hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => isCompleted(item._id)}
                          className="p-2 text-green-600 border hover:bg-green-50 rounded-full transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;