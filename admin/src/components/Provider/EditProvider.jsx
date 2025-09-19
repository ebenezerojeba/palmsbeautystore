import React, { useState } from 'react';
import { Save, X, User, Mail, Phone } from 'lucide-react';

const EditProvider = ({ 
  provider, 
  onSave, 
  onCancel,
  backendUrl 
}) => {
  // Fix: Properly format the profile image URL for preview
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL or data URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    // If it's a relative path, prepend the backend URL
    if (imagePath.startsWith('/')) {
      return `${backendUrl}${imagePath}`;
    }
    
    // For other cases (like paths with backslashes), normalize and prepend backend URL
    return `${backendUrl}/${imagePath.replace(/\\/g, '/')}`;
  };

  const [formData, setFormData] = useState({
    name: provider.name || '',
    email: provider.email || '',
    phone: provider.phone || '',
    bio: provider.bio || '',
    isActive: provider.isActive || false,
    profileImage: null,
    // Fix: Use the formatted URL for preview
    profileImagePreview: provider.profileImage ? formatImageUrl(provider.profileImage) : ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(provider._id, formData);
    } catch (error) {
      console.error('Error saving provider:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImagePreview: ''
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-700 font-medium text-sm sm:text-base"
          >
            ← Back to Provider Details
          </button>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
            Edit Provider
          </h2>

          <div className="hidden sm:block w-24"></div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative self-start sm:self-auto">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  {formData.profileImagePreview ? (
                    <>
                      <img
                        src={formData.profileImagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium text-center px-2">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {formData.profileImagePreview ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />

                <p className="mt-2 text-xs text-gray-500">
                  Recommended: Square JPG, PNG or GIF, at least 200x200 pixels, max 5MB
                </p>

                {formData.profileImagePreview && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center text-sm text-red-600 hover:text-red-800"
                    onClick={removeImage}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              rows={4}
            ></textarea>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProvider;