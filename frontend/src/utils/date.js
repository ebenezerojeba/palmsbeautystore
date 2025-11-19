// utils/dateUtils.js (frontend)

/**
 * Format a Date object to YYYY-MM-DD without timezone conversion
 * @param {Date|string} date 
 * @returns {string} YYYY-MM-DD format
 */
export const formatLocalDate = (date) => {
  // If already a string in correct format, return it
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Convert to Date if needed
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Extract local date components (no UTC conversion!)
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parse YYYY-MM-DD string to local Date object
 * @param {string} dateString 
 * @returns {Date}
 */
export const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Compare two dates (string or Date objects)
 * @param {Date|string} date1 
 * @param {Date|string} date2 
 * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDates = (date1, date2) => {
  const str1 = formatLocalDate(date1);
  const str2 = formatLocalDate(date2);
  
  if (str1 < str2) return -1;
  if (str1 > str2) return 1;
  return 0;
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
export const getTodayString = () => {
  return formatLocalDate(new Date());
};