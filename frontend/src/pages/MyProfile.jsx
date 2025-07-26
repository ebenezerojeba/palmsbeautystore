import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Save, Upload, Loader2 } from "lucide-react";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserProfileData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: `Bearer ${token}`,
      });
      if (data.success) {
        setUserData({
          ...data.user,
          dob: data.user.dob.split("T")[0]
        });
      }
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error("Profile load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfileData = async () => {
  setIsUpdating(true);
  try {
    const formData = new FormData();
    formData.append("userId", userData._id);
    formData.append("name", String(userData?.name || "").trim());
    formData.append("phone", String(userData?.phone || "").trim());
    formData.append(
      "address",
      JSON.stringify({
        line1: userData.address?.line1?.trim() || "",
        line2: userData.address?.line2?.trim() || "",
      })
    );
    formData.append("gender", String(userData?.gender || "").trim());
    formData.append("dob", String(userData?.dob || "").trim());

    if (image) {
      formData.append("image", image);
    }

 const { data } = await axios.put(
  `${backendUrl}/api/user/update-profile`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Include this since you're sending FormData
    },
  }
);


    if (data.success) {
      setUserData({
        ...data.user,
        dob: data.user.dob.split("T")[0],
      });
      toast.success("Profile updated successfully");
      setIsEdit(false);
      setImage(null);
    } else {
      toast.error(data.message || "Update failed");
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Failed to update profile";
    toast.error(errorMsg);
    console.error("Update error:", error);
  } finally {
    setIsUpdating(false);
  }
};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      if (!file.type.match(/image.(jpeg|jpg|png)/)) {
        toast.error("Only JPEG/JPG/PNG images are allowed");
        return;
      }
      setImage(file);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="w-full px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer relative group">
              <img
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
              />
              <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <input
                type="file"
                id="image"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <img
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-gray-200"
              src={userData.image}
              alt="Profile"
            />
          )}

          <div className="w-full">
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-2xl sm:text-3xl font-semibold w-full border-b-2 border-primary py-2 focus:outline-none bg-gray-50"
                placeholder="Full Name"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center sm:text-left">
                {userData.name}
              </h1>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8">
          <h2 className="text-sm text-primary font-semibold uppercase tracking-wide mb-4">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 items-center">
            <span className="font-medium text-gray-700">Email:</span>
            <div className="sm:col-span-2 text-blue-600 break-all">
              {userData.email}
            </div>

            <span className="font-medium text-gray-700">Phone:</span>
            <div className="sm:col-span-2">
              {isEdit ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone: e.target.value
                    }))
                  }
                  className="input-style"
                  placeholder="Phone number"
                />
              ) : (
                <p className="text-blue-500">{userData.phone}</p>
              )}
            </div>

            <span className="font-medium text-gray-700">Address:</span>
            <div className="sm:col-span-2 space-y-2">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    value={userData.address?.line1 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value }
                      }))
                    }
                    className="input-style"
                    placeholder="Street address"
                  />
                  <input
                    type="text"
                    value={userData.address?.line2 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value }
                      }))
                    }
                    className="input-style"
                    placeholder="Apartment, suite, etc."
                  />
                </>
              ) : (
                <div className="text-gray-600 space-y-1">
                  {userData.address?.line1 && <p>{userData.address.line1}</p>}
                  {userData.address?.line2 && <p>{userData.address.line2}</p>}
                  {!userData.address?.line1 && !userData.address?.line2 && (
                    <p className="text-gray-400">No address provided</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="mt-10">
          <h2 className="text-sm text-primary font-semibold uppercase tracking-wide mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 items-center">
            <span className="font-medium text-gray-700">Gender:</span>
            <div className="sm:col-span-2">
              {isEdit ? (
                <select
                  className="input-style"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      gender: e.target.value
                    }))
                  }
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <p>{userData.gender || "Not specified"}</p>
              )}
            </div>

            <span className="font-medium text-gray-700">Birthday:</span>
            <div className="sm:col-span-2">
              {isEdit ? (
                <input
                  type="date"
                  className="input-style"
                  value={userData.dob || ""}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      dob: e.target.value
                    }))
                  }
                />
              ) : (
                <p className="text-gray-600">
                  {userData.dob
                    ? formatDateForDisplay(userData.dob)
                    : "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>

      {/* Action Buttons */}
<div className="mt-10 flex flex-col sm:flex-row gap-4">
  {isEdit ? (
    <>
      <motion.button
        type="button"
        onClick={updateUserProfileData}
        disabled={isUpdating}
        className="inline-flex cursor-pointer items-center justify-center px-6 py-2 rounded-md bg-primary text-gray-800 font-medium shadow-sm transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isUpdating ? 1 : 1.03 }}
        whileTap={{ scale: isUpdating ? 1 : 0.98 }}
      >
        {isUpdating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </motion.button>
    </>
  ) : (
    <motion.button
      type="button"
      onClick={() => setIsEdit(true)}
      className="inline-flex items-center justify-center px-6 py-2 rounded-md border border-primary text-primary font-medium shadow-sm transition hover:bg-primary hover:text-gray-700"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Edit className="w-4 h-4 mr-2" />
      Edit Profile
    </motion.button>
  )}
</div>

      </div>
    </motion.div>
  );
};

export default MyProfile;
