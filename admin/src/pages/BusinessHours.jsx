import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminBusinessHours = ({ token }) => {
  const [businessHours, setBusinessHours] = useState([]);
  const [loading, setLoading] = useState(false);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // Load current hours
  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/business/hours`);
      setBusinessHours(data.businessHours);
    } catch (err) {
      toast.error("Failed to load business hours");
    }
  };

  // Set default hours
  const handleSetDefaultHours = async () => {
    if (!window.confirm("This will overwrite all existing business hours. Continue?")) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/business/defaulthours`,
        {},
        { headers: { token } }
      );
      toast.success(data.message);
      fetchHours();
    } catch (err) {
      toast.error("Failed to set default hours");
    } finally {
      setLoading(false);
    }
  };

  // Update custom hours
  const handleUpdateHours = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${backendUrl}/api/business/updatehours`,
        { businessHours },
        { headers: { token } }
      );
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to update hours");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...businessHours];
    updated[index][field] = field === "isOpen" ? value === "true" : value;
    setBusinessHours(updated);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Business Hours</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Day</th>
              <th className="p-2">Open</th>
              <th className="p-2">Open Time</th>
              <th className="p-2">Close Time</th>
              <th className="p-2">Break Start</th>
              <th className="p-2">Break End</th>
              <th className="p-2">Slot Duration (min)</th>
            </tr>
          </thead>
          <tbody>
            {businessHours.map((hour, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{days[hour.dayOfWeek]}</td>
                <td className="p-2">
                  <select
                    value={hour.isOpen}
                    onChange={(e) => handleChange(index, "isOpen", e.target.value)}
                    className="border p-1"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="time"
                    value={hour.openTime}
                    onChange={(e) => handleChange(index, "openTime", e.target.value)}
                    className="border p-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="time"
                    value={hour.closeTime}
                    onChange={(e) => handleChange(index, "closeTime", e.target.value)}
                    className="border p-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="time"
                    value={hour.breakStart || ''}
                    onChange={(e) => handleChange(index, "breakStart", e.target.value)}
                    className="border p-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="time"
                    value={hour.breakEnd || ''}
                    onChange={(e) => handleChange(index, "breakEnd", e.target.value)}
                    className="border p-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={hour.slotDuration}
                    onChange={(e) => handleChange(index, "slotDuration", e.target.value)}
                    className="border p-1 w-20"
                    min="15"
                    step="15"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleUpdateHours}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          {loading ? "Saving..." : "Save Business Hours"}
        </button>

        <button
          onClick={handleSetDefaultHours}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {loading ? "Setting..." : "Set Default Hours"}
        </button>
      </div>
    </div>
  );
};

export default AdminBusinessHours;