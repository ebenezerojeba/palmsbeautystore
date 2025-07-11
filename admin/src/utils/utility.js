const CONFIG = {
  backendUrl: 'http://localhost:3000',
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  requestTimeout: 30000, // 30 seconds
  maxRetries: 3
};

// Utility functions
export const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) return errors;
  
  if (file.size > CONFIG.maxImageSize) {
    errors.push('Image size must be less than 5MB');
  }
  
  if (!CONFIG.allowedImageTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed');
  } 
  
  return errors;
};
export const sanitizeFormData = (data) => {
  const sanitized = {};
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      sanitized[key] = value.trim() === '' ? null : value.trim();
    } else {
      sanitized[key] = value;
    }
  });
  return sanitized;
};
