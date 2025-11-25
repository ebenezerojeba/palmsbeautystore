
const activeBookingLocks = new Map();

export const acquireBookingLock = async (providerId, date, time) => {
  const lockKey = `${providerId}-${date}-${time}`;
  
  if (activeBookingLocks.has(lockKey)) {
    return false; // Lock already held
  }
  
  activeBookingLocks.set(lockKey, Date.now());
  
  // Auto-release after 30 seconds to prevent deadlocks
  setTimeout(() => {
    activeBookingLocks.delete(lockKey);
  }, 30000);
  
  return true;
};

export const releaseBookingLock = (providerId, date, time) => {
  const lockKey = `${providerId}-${date}-${time}`;
  activeBookingLocks.delete(lockKey);
};