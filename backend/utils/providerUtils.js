// utils/providerUtils.js
// Helper to check if a time slot is available for a provider considering their breaks
export const isTimeSlotAvailable = (provider, date, startTime, duration) => {
  const appointmentDate = new Date(date);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const startDateTime = new Date(appointmentDate);
  startDateTime.setHours(startHour, startMinute, 0, 0);
  
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
  
  // Check if provider has a break during this time
  const hasBreakConflict = provider.breaks.some(breakTime => {
    const breakDate = new Date(breakTime.date);
    if (breakDate.toDateString() !== appointmentDate.toDateString()) return false;
    
    const [breakStartHour, breakStartMinute] = breakTime.startTime.split(':').map(Number);
    const [breakEndHour, breakEndMinute] = breakTime.endTime.split(':').map(Number);
 
    const breakStart = new Date(breakDate);
    breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

    const breakEnd = new Date(breakDate);
    breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);    
    // Check if appointment overlaps with break
    return (
      (startDateTime >= breakStart && startDateTime < breakEnd) ||
      (endDateTime > breakStart && endDateTime <= breakEnd) ||
      (startDateTime <= breakStart && endDateTime >= breakEnd)
    );
  });
 
  return !hasBreakConflict;
};

// Helper to get provider's working hours for a specific day
export const getProviderWorkingHoursForDay = (provider, date) => {
  const dayOfWeek = date.getDay();
  return provider.workingHours.find(wh => wh.dayOfWeek === dayOfWeek && wh.isWorking);
};