import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContexts = createContext();

const AdminContextsProvider = (props) => {
  const [dashData, setDashData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    dashboard: false,
    appointments: false,
    cancelOperation: false,
    completeOperation: false,
  });
  
const [loadingId, setLoadingId] = useState(null);


 
  // const backendUrl = "https://palmsbeauty-backend.vercel.app";
  const backendUrl = "https://palmsbeautystore-backend.onrender.com"

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
    setLoadingId(appointmentId)
    try {
      const response = await fetch(`${backendUrl}/api/admin/cancel-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
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
      toast.error("Failed to cancel appointment");
    } finally {
      setLoadingId(null);
    }
  };

  // API for completing appointment
  const isCompleted = async (appointmentId) => {
    // setLoading("completeOperation", true);
    setLoadingId(appointmentId)
    try {
      const response = await fetch(`${backendUrl}/api/admin/complete-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
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
      toast.error("Failed to complete appointment");
    } finally {
    //   setLoading("completeOperation", false);
    setLoadingId(null)
    }
  };

  // API for Dashboard Data
  const getDashData = async () => {
    setLoading("dashboard", true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/dashboard`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading("dashboard", false);
    }
  };

  // API to get all appointments
  const getAllAppointments = async () => {
    setLoading("appointments", true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/all-appointments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading("appointments", false);
    }
  };

  return (
    <AdminContexts.Provider
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
        loadingId,
        setLoadingId
      }}
    >
      {props.children}
    </AdminContexts.Provider>
  );
};

export default AdminContextsProvider;
