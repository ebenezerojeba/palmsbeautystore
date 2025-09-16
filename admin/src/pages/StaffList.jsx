import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
// import { Button } from "@/components/ui/button";

const StaffList = ({ token }) => {
  const [staff, setStaff] = useState([]);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data.staff);
    } catch (err) {
      console.error("Error fetching staff", err);
    }
  };

  const toggleStatus = async (id) => {
    await axios.patch(`${backendUrl}/api/admin/staff/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchStaff();
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Delete this staff?")) return;
    await axios.delete(`${backendUrl}/api/admin/staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchStaff();
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Staff Management</h2>
      <button onClick={() => window.location.href="/admin/staff/new"}>+ Add Staff</button>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s._id} className="border-t">
              <td className="p-2">
                <img src={s.image} alt="" className="w-10 h-10 rounded-full" />
              </td>
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.role}</td>
              <td className="p-2">{s.isActive ? "Active" : "Inactive"}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => window.location.href=`/admin/staff/${s._id}/edit`}>Edit</button>
                <button onClick={() => toggleStatus(s._id)}>
                  {s.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => deleteStaff(s._id)} className="bg-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
