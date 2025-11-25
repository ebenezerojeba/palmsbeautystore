import { format, parse, addMinutes, addDays, isAfter, isBefore, setHours, setMinutes } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';


const BUSINESS_TIMEZONE = 'America/St_Johns';
// const BUSINESS_TIMEZONE = 'America/Toronto';
// const BUSINESS_TIMEZONE = 'Africa/Lagos';
// or 'America/Vancouver' 

/**
 * Get current date/time in business timezone
 */
export const getCurrentBusinessDateTime = () => {
  return toZonedTime(new Date(), BUSINESS_TIMEZONE);
};

/**
 * Convert a date string to business timezone date object
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Date} Date object in business timezone
 */
export const parseDateInBusinessTz = (dateString) => {
  // Parse the date string as if it's in the business timezone
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return toZonedTime(date, BUSINESS_TIMEZONE);
};

/**
 * Format date for display (always in business timezone)
 * @param {Date|string} date 
 * @returns {string} YYYY-MM-DD format
 */
export const formatDateForDisplay = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const zonedDate = toZonedTime(dateObj, BUSINESS_TIMEZONE);
  return format(zonedDate, 'yyyy-MM-dd');
};

/**
 * Format date for storage (UTC)
 * @param {Date} date 
 * @returns {string} ISO string in UTC
 */
export const formatDateForStorage = (date) => {
  return fromZonedTime(date, BUSINESS_TIMEZONE).toISOString();
};

/**
 * Create a date-time object in business timezone
 * @param {string} dateString - YYYY-MM-DD
 * @param {string} timeString - HH:mm
 * @returns {Date} Date object in business timezone
 */
export const createBusinessDateTime = (dateString, timeString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create date in local time, then convert to business timezone
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return toZonedTime(localDate, BUSINESS_TIMEZONE);
};

/**
 * Get day of week (0-6) for a date in business timezone
 * @param {Date|string} date 
 * @returns {number} Day of week (0 = Sunday, 6 = Saturday)
 */
export const getBusinessDayOfWeek = (date) => {
  const dateObj = typeof date === 'string' ? parseDateInBusinessTz(date) : date;
  const zonedDate = toZonedTime(dateObj, BUSINESS_TIMEZONE);
  return zonedDate.getDay();
};

/**
 * Check if a date is today in business timezone
 * @param {Date|string} date 
 * @returns {boolean}
 */
export const isBusinessToday = (date) => {
  const dateObj = typeof date === 'string' ? parseDateInBusinessTz(date) : date;
  const zonedDate = toZonedTime(dateObj, BUSINESS_TIMEZONE);
  const today = getCurrentBusinessDateTime();
  
  return format(zonedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

/**
 * Add minutes to a date-time
 * @param {Date} date 
 * @param {number} minutes 
 * @returns {Date}
 */
export const addMinutesToDateTime = (date, minutes) => {
  return addMinutes(date, minutes);
};

/**
 * Add days to a date
 * @param {Date} date 
 * @param {number} days 
 * @returns {Date}
 */
export const addDaysToDate = (date, days) => {
  return addDays(date, days);
};

/**
 * Compare two date-times
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDateTimes = (date1, date2) => {
  if (isBefore(date1, date2)) return -1;
  if (isAfter(date1, date2)) return 1;
  return 0;
};

/**
 * Format time string from Date object
 * @param {Date} date 
 * @returns {string} HH:mm format
 */
export const formatTimeFromDate = (date) => {
  return format(date, 'HH:mm');
};

/**
 * Get date range for availability queries
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Array<string>} Array of date strings in YYYY-MM-DD format
 */
export const getDateRangeStrings = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(formatDateForDisplay(currentDate));
    currentDate = addDaysToDate(currentDate, 1);
  }
  
  return dates;
};

/**
 * Parse time string and apply to date
 * @param {Date} date 
 * @param {string} timeString - HH:mm format
 * @returns {Date}
 */
export const applyTimeToDate = (date, timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  let result = setHours(date, hours);
  result = setMinutes(result, minutes);
  return result;
};

/**
 * Get current hour in business timezone
 * @returns {number}
 */
export const getCurrentBusinessHour = () => {
  return getCurrentBusinessDateTime().getHours();
};

/**
 * Get current minute in business timezone
 * @returns {number}
 */
export const getCurrentBusinessMinute = () => {
  return getCurrentBusinessDateTime().getMinutes();
};
/**
 * Create date range for database queries (handles timezone properly)
 * @param {string} dateString - YYYY-MM-DD format
 * @returns {Object} { start: Date, end: Date } for MongoDB query
 */
export const getDateRangeForQuery = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Start of day at 00:00 in business timezone
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const businessStart = fromZonedTime(startOfDay, BUSINESS_TIMEZONE);
  
  // End of day at 23:59:59 in business timezone
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
  const businessEnd = fromZonedTime(endOfDay, BUSINESS_TIMEZONE);
  
  return { start: businessStart, end: businessEnd };
};
export { BUSINESS_TIMEZONE };






