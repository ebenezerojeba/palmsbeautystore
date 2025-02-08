import React, { useEffect, useContext } from 'react';
import { Check, Clock, Users } from 'lucide-react';
import { AdminContext } from '../context/adminContext';
import { assets } from '../assets/assets';

const Dashboard = () => {
  const { dashData, getDashData,slotDateFormat,cancelAppointment, isCompleted } = useContext(AdminContext);

  useEffect(() => {
    getDashData();
  }, []);


  const StatCard = ({ icon, value, label, bgColor, textColor }) => (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 flex-col items-center space-x-3 sm:space-x-3 hover:shadow-xl transition-shadow">
      <div className={`${bgColor} p-2 sm:p-2 rounded-lg items-center flex justify-center`}>
        {React.cloneElement(icon, {
          className: `${textColor}`
        })}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold ${textColor}">{value}</p>
        <p className="text-xs sm:text-lg text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );

  return (
    dashData && (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols- sm:grid-cols-2 gap-4 sm:gap-6">
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
            icon={<Users />}
            value={dashData.totalAppointments}
            label="Total Appointments"
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
        </div>


<div className='bg-white'>
  <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t-border'>
    <img src={assets.list_icon} alt="List Icon" />
    <p className='font-semibold'>Latest Bookings</p>
  </div>

  <div className='pt-4 border border-t-0'>
{
  dashData.latestAppointments.map((item, index)=>(
    <div key={index} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100'>
      <img src={item} alt="" />
      <p>{item.serviceTitle}</p>
      <div>
        <p>{item.userDetails.name}</p>
        <p>{item.userDetails.email}</p>
        <p>{item.userDetails.phone}</p>
        <p>{slotDateFormat(item.date)}</p>
        <p>{slotDateFormat(item.time)}</p>
      
      </div>


  {/* ✅ Show only one status at a time */}
  {item.cancelled ? (
        <p className='cursor-pointer text-red-500 text-xs font-medium'>Cancelled</p>
      ) : item.isCompleted ? (
        <p className='cursor-pointer text-green-500 text-xs font-medium'>Completed</p>
      ) : (
        <>
          <img 
            onClick={() => cancelAppointment(item._id)} 
            src={assets.cancel_icon} 
            alt="Cancel-Icon" 
          />
          <img 
            onClick={() => isCompleted(item._id)} 
            src={assets.tick_icon} 
            alt="Completed-Icon" 
          />
        </>
      )}
    </div>
  ))
}
  </div>
</div>

      </div>
    )
  );
};

export default Dashboard;