import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Save, Upload, Loader2, X, Camera } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

    // Cleanup image preview on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  const updateUserProfileData = async () => {
  setIsUpdating(true);
  setIsLoading(true)
  try {
    const formData = new FormData();

    // Ensure userId is present
    formData.append("userId", userData._id);

    // Convert fields safely to string before trimming
    const name = typeof userData.name === "string" ? userData.name.trim() : "";
    const phone = typeof userData.phone === "string" || typeof userData.phone === "number"
      ? String(userData.phone).trim()
      : "";
    const gender = typeof userData.gender === "string" ? userData.gender.trim() : "";
    const dob = typeof userData.dob === "string" ? userData.dob.trim() : "";

    if (name) formData.append("name", name);
    if (phone) formData.append("phone", phone);
    if (gender) formData.append("gender", gender);
    if (dob) formData.append("dob", dob);

    if (
      userData.address &&
      (userData.address.line1?.trim?.() || userData.address.line2?.trim?.())
    ) {
      formData.append(
        "address",
        JSON.stringify({
          line1: userData.address.line1?.trim?.() || "",
          line2: userData.address.line2?.trim?.() || "",
        })
      );
    }

    if (image) {
      formData.append("image", image);
    }

    const { data } = await axios.put(
      `${backendUrl}/api/user/update-profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success) {
      setUserData({
        ...data.user,
        dob: data.user.dob ? data.user.dob.split("T")[0] : "",
      });
      toast.success("Profile updated successfully");
      setIsEdit(false);
      setImage(null);
      setImagePreview(null);
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
    setIsLoading(false)
  }
};


 const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        toast.error("Only JPEG/JPG/PNG/WebP images are allowed");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setImage(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    // Reload original data to reset any changes
    loadUserProfileData();
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <motion.div
        className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Profile Image */}
         {/* Profile Image */}
              <div className="relative group">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer relative group">
                    <img
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary"
                      src={imagePreview || userData.image || assets.defaultProfileImage}
                      alt="Profile"
                    />
                    <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <input
                      type="file"
                      id="image"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <img
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-gray-200"
                    src={userData.image || assets.defaultProfileImage}
                    alt="Profile"
                  />
                )}
              </div>

              {/* Name and Basic Info */}
              <div className="flex-1 text-center lg:text-left">
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.name || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold w-full border-b-2 border-primary py-3 focus:outline-none bg-transparent placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {userData.name || "User Name"}
                  </h1>
                )}
                <p className="text-gray-600 text-lg">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-6 sm:p-8">
            {/* Contact Information */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  {isEdit ? (
                    <input
                      type="tel"
                      value={userData.phone || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          phone: e.target.value
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {userData.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg break-all">
                    {userData.email}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                {isEdit ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={userData.address?.line1 || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value }
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    {userData.address?.line1 || userData.address?.line2 ? (
                      <>
                        {userData.address.line1 && <p className="text-gray-900">{userData.address.line1}</p>}
                        {userData.address.line2 && <p className="text-gray-900">{userData.address.line2}</p>}
                      </>
                    ) : (
                      <p className="text-gray-500">No address provided</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  {isEdit ? (
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      value={userData.gender || ""}
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
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {userData.gender || "Not specified"}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  {isEdit ? (
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {formatDateForDisplay(userData.dob)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              {isEdit ? (
                <>
                  <motion.button
                    type="button"
                    onClick={updateUserProfileData}
                    disabled={isUpdating}
                    className="flex-1 sm:flex-none inline-flex items-center outline shadow justify-center px-8 py-3 rounded-lg bg-primary text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: isUpdating ? 1 : 1.02 }}
                    whileTap={{ scale: isUpdating ? 1 : 0.98 }}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isUpdating}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50 outline-inherit focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: isUpdating ? 1 : 1.02 }}
                    whileTap={{ scale: isUpdating ? 1 : 0.98 }}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => setIsEdit(true)}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-primary text-primary font-medium shadow-sm hover:bg-primaryfocus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;