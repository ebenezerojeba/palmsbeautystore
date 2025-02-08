import { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [dashData, setDashData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = "http://localhost:3000/";

  const months = [
    "",
    "Jan",
    "Feb",
    "MArch",
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

  // API for cancelling apppointment
  const cancelAppointment = async (appointmentId) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}api/admin/cancel-appointment`,
        { appointmentId }
      );
      if (data.success) {
        toast.success(data.message);

        // ✅ Update state after cancellation
        setDashData((prevData) => ({
          ...prevData,
          latestAppointments: prevData.latestAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, cancelled: true } // Mark as cancelled
              : appointment
          ),
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
    finally{
      setIsLoading(false);
    }
  };

  // API for completing appointment
  const isCompleted = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}api/admin/complete-appointment`,
        { appointmentId }
      );
      if (data.success) {
        toast.success(data.message);

           // ✅ Update state to reflect completed status
           setDashData((prevData) => ({
            ...prevData,
            completedAppointments: data.isCompleted ? prevData.completedAppointments + 1 : prevData.completedAppointments,
            pendingAppointments: prevData.pendingAppointments - 1,
            latestAppointments: prevData.latestAppointments.map((appointment) =>
              appointment._id === appointmentId
                ? { ...appointment, isCompleted: true }
                : appointment
            ),
          }));

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };
  // API for Dashboard Data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}api/admin/dashboard`, {
        headers: { "Content-Type": "application/json" },
      });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  };

  // API to get all appointmnents
  const getAllAppointments = async (params) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}api/admin/all-appointments`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
        isLoading,
        setIsLoading
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
