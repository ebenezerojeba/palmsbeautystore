import React, { useState, useEffect } from "react";
import axios from "axios";
// import { backendUrl } from "../App";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = 'http://localhost:3000'; // Adjust as needed
const StaffForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`${backendUrl}/api/admin/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setForm(res.data.staff));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    if (image) data.append("image", image);

    if (id) {
      await axios.put(`${backendUrl}/api/admin/staff/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${backendUrl}/api/admin/staff`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    navigate("/staff");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input type="text" value={form.name} placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full" />
      <input type="text" value={form.role} placeholder="Role"
        onChange={e => setForm({ ...form, role: e.target.value })}
        className="border p-2 w-full" />
      <input type="email" value={form.email} placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="border p-2 w-full" />
      <input type="tel" value={form.phone} placeholder="Phone"
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className="border p-2 w-full" />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button type="submit" onSubmit={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
        {id ? "Update Staff" : "Create Staff"}
      </button>
    </form>
  );
};

export default StaffForm;
