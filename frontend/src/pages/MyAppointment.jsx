import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MyAppointment = () => {
  const { userAppointments } = useContext(AppContext); // Assuming you store user appointments in context
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (userAppointments) {
      setAppointments(userAppointments);
    }
  }, [userAppointments]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Appointments</h1>

      {appointments.length > 0 ? (
        <div className="grid gap-6">
          {appointments.map((appointment, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">{appointment.serviceTitle}</h2>
              <p className="text-gray-600">📅 {new Date(appointment.date).toDateString()}</p>
              <p className="text-gray-600">⏰ {appointment.time}</p>
              <p className="text-gray-700 font-medium">💰 Price: ₦{appointment.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no appointments yet.</p>
      )}
    </div>
  );
};

export default MyAppointment;
