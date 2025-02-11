import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [dashData, setDashData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    dashboard: false,
    appointments: false,
    cancelOperation: false,
    completeOperation: false,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const months = [
    "",
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    return slotDate.split("T")[0];
  };

  const setLoading = (key, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // API for cancelling appointment
  const cancelAppointment = async (appointmentId) => {
    setLoading("cancelOperation", true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId }
      );
      if (data.success) {
        toast.success(data.message);

        // Update the Dashboard Data with null check
        setDashData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            cancelledAppointments: data.isCancelled
              ? (prevData.cancelledAppointments || 0) + 1
              : prevData.cancelledAppointments || 0,
            pendingAppointments: Math.max(
              0,
              (prevData.pendingAppointments || 0) - 1
            ),
            latestAppointments:
              prevData.latestAppointments?.map((appointment) =>
                appointment._id === appointmentId
                  ? { ...appointment, isCancelled: true }
                  : appointment
              ) || [],
          };
        });

        // Update the appointment data
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, isCancelled: true }
              : appointment
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    } finally {
      setLoading("cancelOperation", false);
    }
  };

  // API for completing appointment
  const isCompleted = async (appointmentId) => {
    setLoading("completeOperation", true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/complete-appointment`,
        { appointmentId }
      );
      if (data.success) {
        toast.success(data.message);

        // Update Dashboard with null check
        setDashData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            completedAppointments: data.isCompleted
              ? (prevData.completedAppointments || 0) + 1
              : prevData.completedAppointments || 0,
            pendingAppointments: Math.max(
              0,
              (prevData.pendingAppointments || 0) - 1
            ),
            latestAppointments:
              prevData.latestAppointments?.map((appointment) =>
                appointment._id === appointmentId
                  ? { ...appointment, isCompleted: true }
                  : appointment
              ) || [],
          };
        });

        // Update appointment status
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, isCompleted: true }
              : appointment
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete appointment"
      );
    } finally {
      setLoading("completeOperation", false);
    }
  };

  // API for Dashboard Data
  const getDashData = async () => {
    setLoading("dashboard", true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { "Content-Type": "application/json" },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    } finally {
      setLoading("dashboard", false);
    }
  };

  // API to get all appointments
  const getAllAppointments = async () => {
    setLoading("appointments", true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-appointments`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading("appointments", false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        appointments,
        setAppointments,
        getAllAppointments,
        dashData,
        getDashData,
        cancelAppointment,
        slotDateFormat,
        isCompleted,
        loadingStates,
        months,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
