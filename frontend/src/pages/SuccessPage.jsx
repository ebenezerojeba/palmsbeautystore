

import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import emailjs from '@emailjs/browser';
// import emailjs from "emailjs-com";

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (location.state?.appointment) {
        setAppointment(location.state.appointment);
        setLoading(false);
        return;
      }

      if (appointmentId) {
        const { data } = await axios.get(`/api/appointment/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setAppointment(data.appointment);
        } else {
          throw new Error(data.message || "Failed to fetch appointment");
        }
      } else {
        throw new Error("No appointment ID provided");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to fetch appointment details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Send email once appointment is fetched
  useEffect(() => {
    if (appointment) {
      const templateParams = {
        to_email: appointment.userEmail, // must exist in your appointment object
        service: appointment.serviceTitle,
        date: format(new Date(appointment.date), "EEEE, MMMM do, yyyy"),
        time: appointment.time,
        amount: appointment.payment?.amount
          ? `$${appointment.payment.amount}`
          : "N/A",
        status: appointment.status,
      };

      emailjs
        .send(
          "service_zjrxg1k", // from EmailJS
          "template_4zpkil9",
          templateParams,
          "eqHzO2GNucYkGcSLo", // from EmailJS
        )
        .then(
          (response) => {
            console.log("✅ Email sent successfully!", response.status, response.text);
          },
          (err) => {
            console.error("❌ Failed to send email:", err);
          }
        );
    }
  }, [appointment]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAppointment();
  }, [appointmentId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Appointment</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={fetchAppointment}
            >
              Try Again
            </button>
            <button 
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              onClick={() => navigate('/appointments')}
            >
              View All Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-red-500 text-lg mb-4">Appointment not found</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => navigate('/appointments')}
          >
            View All Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-xl p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="h-20 w-20 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Your appointment has been confirmed. We've sent a confirmation email with all the details.
        </p>

        {/* Appointment Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Appointment Details with {appointment.providerName}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">Service</p>
                <p className="text-gray-600">{appointment.serviceTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">Date</p>
                <p className="text-gray-600">
                  {format(new Date(appointment.date), "EEEE, MMMM do, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">Time</p>
                <p className="text-gray-600">{appointment.time}</p>
              </div>
            </div>

            {appointment.payment?.amount && (
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Amount Paid</p>
                  <p className="text-gray-600">${appointment.payment.amount}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-gray-800">Status</p>
                <p className="text-green-600 capitalize font-medium">{appointment.status}</p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={() => navigate('/my-appointments')}
          >
            View All Appointments
          </button>
          
          <button 
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}