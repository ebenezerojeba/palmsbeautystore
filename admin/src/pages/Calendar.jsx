
import React, { useState, useContext, useEffect } from "react";
import {
  X,
  Check,
  Loader,
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Download,
  Settings,
  RefreshCw,
  Plus
} from "lucide-react";
import { AdminContexts } from "../context/AdminContexts";

const Calendar = () => {
  // Mock context - replace with your actual context
   const {
    appointments,
    getAllAppointments,
    cancelAppointment,
    isCompleted,
    slotDateFormat,
    loadingStates
  } = useContext(AdminContexts  );

  useEffect(() => {
    getAllAppointments();
  }, []);
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('month'); // month, week, day

  // Service colors mapping
  const serviceColors = {
    'Cornrow': 'bg-red-200 text-red-800 border-red-300',
    'Lashes': 'bg-orange-200 text-orange-800 border-orange-300',
    'Weave-ons': 'bg-amber-200 text-amber-800 border-amber-300',
    'Crochet': 'bg-yellow-200 text-yellow-800 border-yellow-300',
    'Brows': 'bg-green-200 text-green-800 border-green-300',
    'Butterfly Locs': 'bg-blue-200 text-blue-800 border-blue-300',
    'Washing': 'bg-purple-200 text-purple-800 border-purple-300',
    'Hair Perming': 'bg-pink-200 text-pink-800 border-pink-300',
    'Hair cut (women)': 'bg-indigo-200 text-indigo-800 border-indigo-300'
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Components
  const AppointmentCard = ({ appointment, isCompact = false }) => {
    const colorClass = serviceColors[appointment.serviceTitle] || 'bg-gray-200 text-gray-800 border-gray-300';
    
    return (
      <div
        className={`${colorClass} rounded-md border p-2 mb-1 cursor-pointer hover:shadow-md transition-all duration-200 ${
          isCompact ? 'text-xs' : 'text-sm'
        }`}
        onClick={() => setSelectedAppointment(appointment)}
      >
        <div className="font-medium truncate">{appointment.serviceTitle}</div>
        <div className="truncate opacity-90">{appointment.userName}</div>
        {!isCompact && (
          <div className="text-xs opacity-75 mt-1">{appointment.time}</div>
        )}
      </div>
    );
  };

  const CalendarDay = ({ date, appointments: dayAppointments }) => {
    const isToday = date && date.toDateString() === new Date().toDateString();
    const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();
    
    return (
      <div className={`min-h-[120px] p-2 border border-gray-200 bg-white ${
        isToday ? 'bg-blue-50 border-blue-300' : ''
      } ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}`}>
        {date && (
          <>
            <div className={`text-sm font-medium mb-2 ${
              isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {date.getDate()}
            </div>
            <div className="space-y-1 max-h-[80px] overflow-y-auto">
              {dayAppointments.map((apt, idx) => (
                <AppointmentCard key={apt._id} appointment={apt} isCompact={true} />
              ))}
              {dayAppointments.length > 0 && dayAppointments.length <= 2 && (
                <div className="text-xs text-gray-500 mt-1">
                  {dayAppointments.length} appointment{dayAppointments.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const AppointmentModal = ({ appointment, onClose }) => {
    if (!appointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${serviceColors[appointment.serviceTitle] || 'bg-gray-100'}`}>
                <h3 className="font-semibold text-lg">{appointment.serviceTitle}</h3>
                <p className="opacity-90">{appointment.userName}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{appointment.userPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{appointment.userEmail}</span>
                </div>
              </div>

              {!appointment.isCancelled && !appointment.isCompleted && (
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loadingStates.appointments) {
    return (
      <div className="w-full p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-16 bg-gray-200 rounded w-full mb-6"></div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
     
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg
                  hover:bg-pink-600 transition-colors text-sm font-medium"
                >
                  Today
                </button>
              </div>
            </div>
          </div>
      </div>
      </div>
     
      {/* Calendar Grid */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 text-2xl">
              {getDaysInMonth(currentDate).map((date, index) => (
                <CalendarDay
                  key={index}
                  date={date}
                  appointments={date ? getAppointmentsForDate(date) : []}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
};

export default Calendar;