  import React from "react";
  const StatCard = ({ icon, value, label, bgColor, textColor, status, onClick }) => {

    const getFilterTitle = (status) => {
        const titles = {
          completed: 'Completed Appointments',
          pending: 'Pending Appointments',
          cancelled: 'Cancelled Appointments',
          all: 'Latest Bookings'
        };
        return titles[status] || 'Latest Bookings';
      };
    
    
    
    
    
      const getFilteredAppointments = () => {
        // Use all appointments for filtering if not showing latest
        const appointmentsToFilter = filterStatus === 'all' 
          ? dashData?.latestAppointments || []
          : appointments || [];
        
        switch (filterStatus) {
          case 'completed':
            return appointmentsToFilter.filter(apt => apt.isCompleted);
          case 'pending':
            return appointmentsToFilter.filter(apt => !apt.isCompleted && !apt.isCancelled);
          case 'cancelled':
            return appointmentsToFilter.filter(apt => apt.isCancelled);
          default:
            return dashData?.latestAppointments || [];
        }
      };
      const filteredAppointments = getFilteredAppointments();

  return(
    <div 
      className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-lg cursor-pointer
        ${filterStatus === status ? 'ring-1 ring-offset-0 ' + bgColor : ''}`}
      onClick={() => onClick(status)}
    >
      <div className="flex items-start space-x-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          {React.cloneElement(icon, {
            className: `${textColor} w-6 h-6`,
          })}
        </div>
        <div>
          <p className={`text-3xl font-bold ${textColor} mb-1`}>{value || 0}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  )

  };

  export default StatCard