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

  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  

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


  }

  // Updated Admin Context Funct


  const cancelAppointment = async (appointmentId, reason = "Cancelled by admin", cancelledBy = "provider") => {
  setLoadingId(appointmentId);
  
  try {
    // Better token retrieval with validation
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      setLoadingId(null);
      return;
    }

    // Add validation
    if (!appointmentId) {
      toast.error("Invalid appointment ID");
      setLoadingId(null);
      return;
    }

    const response = await fetch(`${backendUrl}/api/admin/cancel-appointment`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "token": token
        // "Authorization": `Bearer ${token}` // Always include token for admin routes
      },
      body: JSON.stringify({ 
        appointmentId, 
        reason: reason.trim(), // Ensure reason is trimmed
        cancelledBy 
      }),
    });

    // Handle different response types
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      throw new Error("Invalid server response");
    }

    if (response.ok) {
      toast.success(data.message);

      // Update dashboard data
      setDashData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          cancelledAppointments: (prevData.cancelledAppointments || 0) + 1,
          pendingAppointments: Math.max(0, (prevData.pendingAppointments || 0) - 1),
          latestAppointments:
            prevData.latestAppointments?.map((appointment) =>
              appointment._id === appointmentId
                ? { 
                    ...appointment, 
                    status: 'cancelled', 
                    cancelledAt: new Date().toISOString(),
                    cancellation: {
                      cancelledBy,
                      reason,
                      refundEligible: data.appointment?.cancellation?.refundEligible || false,
                      cancellationFee: data.appointment?.cancellation?.cancellationFee || 0
                    }
                  }
                : appointment
            ) || [],
        };
      });

      // Update appointments list
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { 
                ...appointment, 
                status: 'cancelled', 
                cancelledAt: new Date().toISOString(),
                cancellation: {
                  cancelledBy,
                  reason,
                  refundEligible: data.appointment?.cancellation?.refundEligible || false,
                  cancellationFee: data.appointment?.cancellation?.cancellationFee || 0
                }
              }
            : appointment
        )
      );
    } else {
      // Handle specific error codes
      if (response.status === 403) {
        toast.error("You don't have permission to cancel this appointment");
      } else if (response.status === 401) {
        toast.error("Authentication expired. Please log in again.");
      } else if (response.status === 404) {
        toast.error("Appointment not found");
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    }
  } catch (error) {
    console.error("Cancel appointment error:", error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("Failed to cancel appointment. Please try again.");
    }
  } finally {
    setLoadingId(null);
  }
};

// Alternative version with admin input for cancellation reason
const cancelAppointmentWithReason = async (appointmentId) => {
  // You might want to show a modal/dialog to get the reason
  const reason = prompt("Please provide a reason for cancellation:") || "Cancelled by admin";
  
  if (reason.trim()) {
    await cancelAppointment(appointmentId, reason, "provider");
  }
};

// Usage examples:
// For simple admin cancellation:
// cancelAppointment(appointmentId);

// For admin cancellation with custom reason:
// cancelAppointment(appointmentId, "Service unavailable", "provider");

// For admin cancellation with input dialog:
// cancelAppointmentWithReason(appointmentId);

  // API for completing appointment (renamed from isCompleted)
  const completeAppointment = async (appointmentId) => {
    setLoadingId(appointmentId);
    try {
      const response = await fetch(`${backendUrl}/api/admin/complete-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        // Update dashboard data with new status-based logic
        setDashData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            completedAppointments: (prevData.completedAppointments || 0) + 1,
            pendingAppointments: Math.max(0, (prevData.pendingAppointments || 0) - 1),
            latestAppointments:
              prevData.latestAppointments?.map((appointment) =>
                appointment._id === appointmentId
                  ? { ...appointment, status: 'completed', completedAt: new Date() }
                  : appointment
              ) || [],
          };
        });

        // Update appointments list
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: 'completed', completedAt: new Date() }
              : appointment
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Complete appointment error:", error);
      toast.error("Failed to complete appointment");
    } finally {
      setLoadingId(null);
    }
  };

  // NEW: API for confirming appointment
  const confirmAppointment = async (appointmentId) => {
    setLoadingId(appointmentId);
    try {
      const response = await fetch(`${backendUrl}/api/admin/confirm-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        // Update dashboard data
        setDashData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            confirmedAppointments: (prevData.confirmedAppointments || 0) + 1,
            pendingAppointments: Math.max(0, (prevData.pendingAppointments || 0) - 1),
            latestAppointments:
              prevData.latestAppointments?.map((appointment) =>
                appointment._id === appointmentId
                  ? { ...appointment, status: 'confirmed', confirmedAt: new Date() }
                  : appointment
              ) || [],
          };
        });

        // Update appointments list
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: 'confirmed', confirmedAt: new Date() }
              : appointment
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Confirm appointment error:", error);
      toast.error("Failed to confirm appointment");
    } finally {
      setLoadingId(null);
    }
  };

  // NEW: API for marking appointment as no-show
  const markNoShow = async (appointmentId) => {
    setLoadingId(appointmentId);
    try {
      const response = await fetch(`${backendUrl}/api/admin/mark-no-show`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        // Update dashboard data
        setDashData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            noShowAppointments: (prevData.noShowAppointments || 0) + 1,
            confirmedAppointments: Math.max(0, (prevData.confirmedAppointments || 0) - 1),
            latestAppointments:
              prevData.latestAppointments?.map((appointment) =>
                appointment._id === appointmentId
                  ? { ...appointment, status: 'no-show' }
                  : appointment
              ) || [],
          };
        });

        // Update appointments list
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: 'no-show' }
              : appointment
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Mark no-show error:", error);
      toast.error("Failed to mark as no-show");
    } finally {
      setLoadingId(null);
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
      console.error("Dashboard data error:", error);
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
      console.error("Get appointments error:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading("appointments", false);
    }
  };

  // NEW: API to get appointments by status with pagination
  const getAppointmentsByStatus = async (status, page = 1, limit = 20, startDate = null, endDate = null) => {
    setLoading("appointmentsByStatus", true);
    try {
      const params = new URLSearchParams({
        status,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${backendUrl}/api/admin/appointments/status?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        return data; // Return the data with appointments and pagination info
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.error("Get appointments by status error:", error);
      toast.error("Failed to fetch appointments by status");
      return null;
    } finally {
      setLoading("appointmentsByStatus", false);
    }
  };

  // NEW: API to update payment status
  const updatePaymentStatus = async (appointmentId, paymentData) => {
    setLoadingId(appointmentId);
    try {
      const response = await fetch(`${backendUrl}/api/admin/payment/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        // Update appointments list with new payment info
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, payment: data.appointment.payment }
              : appointment
          )
        );

        // Update dashboard data if needed
        setDashData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            paidAppointments: paymentData.status === 'paid'
              ? (prevData.paidAppointments || 0) + 1
              : prevData.paidAppointments,
            latestAppointments:
              prevData.latestAppointments?.map((appointment) =>
                appointment._id === appointmentId
                  ? { ...appointment, payment: data.appointment.payment }
                  : appointment
              ) || [],
          };
        });

        return data.appointment;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.error("Update payment status error:", error);
      toast.error("Failed to update payment status");
      return null;
    } finally {
      setLoadingId(null);
    }
  };

  // Legacy function for backward compatibility
  const isCompleted = completeAppointment;

  return (
    <AdminContexts.Provider
      value={{
        appointments,
        dashData,
        setAppointments,
        slotDateFormat,
        getAllAppointments,
        cancelAppointment,
        completeAppointment,
        confirmAppointment,
        markNoShow,
        getDashData,
        getAllAppointments,
        getAppointmentsByStatus,
        updatePaymentStatus,
        isCompleted,
        setLoadingId,
        loadingStates,
        months,
        loadingId,
      }}
    >
      {props.children}
    </AdminContexts.Provider>
  );
};

export default AdminContextsProvider;
