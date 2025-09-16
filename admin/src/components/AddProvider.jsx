import React, { useState } from "react";

export default function CreateProviderForm({ onCreate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    bookingBuffer: 15,
    services: [],
    workingHours: []
  });
  const [profileImageFile, setProfileImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await onCreate({
        ...formData,
        profileImageFile
      });
      console.log("Provider created:", result);
      alert("Provider created successfully!");
    } catch (err) {
      alert("Error creating provider: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
      <textarea name="bio" placeholder="Bio" onChange={handleChange}></textarea>
      <input type="number" name="bookingBuffer" placeholder="Booking Buffer" onChange={handleChange} />
      
      <input type="file" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files[0])} />
      
      <button type="submit">Create Provider</button>
    </form>
  );
}
