import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useParams } from "react-router-dom";

const StaffAppointments = ({ token }) => {
  const { staffId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(""); // optional filter

  const fetchAppointments = async () => {
    try {
      const url = `${backendUrl}/api/admin/staff/${staffId}/appointments`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: date ? { date } : {},
      });
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error("Error fetching staff appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [staffId, date]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Staff Appointments</h2>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm">Filter by Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2"
        />
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Client</th>
            <th className="p-2">Services</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id} className="border-t">
              <td className="p-2">{appt.date}</td>
              <td className="p-2">{appt.time}</td>
              <td className="p-2">
                {appt.userId?.name} <br />
                <span className="text-xs text-gray-500">
                  {appt.userId?.email}, {appt.userId?.phone}
                </span>
              </td>
              <td className="p-2">
                {appt.services.map((s, i) => (
                  <div key={i}>
                    {s.serviceId?.title} ({s.serviceId?.duration} min)
                  </div>
                ))}
              </td>
              <td className="p-2 capitalize">{appt.status}</td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffAppointments;
