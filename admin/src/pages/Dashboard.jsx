import React, { useEffect, useContext, useState } from "react";
import { 
  Clock, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Filter,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Activity,
  DollarSign,
  X,
  Eye,
  NotebookPen
} from "lucide-react";
import { AdminContexts } from "../context/AdminContexts";

const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

const Dashboard = () => {
  const {
    dashData,
    getDashData,
    slotDateFormat,
    appointments,
    getAllAppointments,
  } = useContext(AdminContexts);

  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load dashboard data and appointments on mount - only once
    const loadData = async () => {
      try {
        await Promise.all([getDashData(), getAllAppointments()]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadData();
  }, []); // Empty dependency array - only run once on mount

  // No need for second useEffect - stats are calculated from appointments data directly

  const getFilteredAppointments = () => {
    // Always use the latest appointments data from context
    const appointmentsToFilter = filterStatus === 'all' 
      ? (appointments || []).slice(0, 10) // Show latest 10 for dashboard
      : (appointments || []).filter(apt => {
          const status = getAppointmentStatus(apt);
          return status === filterStatus;
        });

    return appointmentsToFilter.sort((a, b) => {
      // Sort by date and time, most recent first
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    });
  };

  // Centralized status determination
  const getAppointmentStatus = (appointment) => {
    if (appointment?.status) return appointment.status;
    if (appointment?.isCompleted) return 'completed';
    if (appointment?.isCancelled) return 'cancelled';
    return 'pending';
  };

const getStatusStats = () => {
    const stats = {
      completed: dashData?.completedAppointments || 0,
      pending: dashData?.pendingAppointments || 0,
      confirmed: dashData?.confirmedAppointments || 0,
      cancelled: dashData?.cancelledAppointments || 0,
      total: dashData?.totalAppointments || 0,
      revenue: dashData?.totalRevenue || 0,
      noShow: dashData?.noShowAppointments || 0
    };
    return stats;
  };


  const StatCard = ({ icon, value, label, bgColor, textColor, status, trend, onClick, isRevenue = false }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-200 hover:shadow-md cursor-pointer hover:border-gray-300
        ${filterStatus === status ? 'ring-2 ring-gray-500 border-gray-500' : ''}`}
      onClick={() => onClick && onClick(status)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`${bgColor} p-2 rounded-lg`}>
          {React.cloneElement(icon, {
            className: `${textColor} w-4 h-4 sm:w-5 sm:h-5`,
          })}
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            +{trend}%
          </div>
        )}
      </div>
      <div>
        <p className={`text-lg sm:text-xl font-bold ${textColor} mb-1`}>
          {isRevenue ? `$${value?.toLocaleString() || 0}` : (value || 0)}
        </p>
        <p className="text-xs sm:text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );

  const handleFilterClick = (status) => {
    setFilterStatus(status === filterStatus ? 'all' : status);
  };

  const StatusBadge = ({ status, item }) => {
    const actualStatus = getAppointmentStatus(item);

    const styles = {
      cancelled: "bg-red-50 text-red-700 border border-red-200",
      completed: "bg-green-50 text-green-700 border border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
      'no-show': "bg-gray-50 text-gray-700 border border-gray-200",
    };
    
    const displayText = {
      cancelled: 'Cancelled',
      completed: 'Completed',
      pending: 'Pending',
      confirmed: 'Confirmed',
      'no-show': 'No Show'
    };
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[actualStatus]}`}>
        {displayText[actualStatus] || actualStatus}
      </span>
    );
  };

  // Loading state - show skeleton while loading
  if (!appointments && !dashData) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-3 h-20" />
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 h-48" />
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();
  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col space-y-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Appointments and business performance overview
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            icon={<Activity />}
            value={stats.total}
            label="Total"
            bgColor="bg-purple-100"
            textColor="text-purple-600"
            status="all"
            trend={12}
            onClick={() => navigate('/appointments')}
          />
          <StatCard
            icon={<Clock />}
            value={stats.pending}
            label="Pending"
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
            status="pending"
            onClick={handleFilterClick}
          />
          <StatCard
            icon={<CheckCircle />}
            value={stats.confirmed}
            label="Confirmed"
            bgColor="bg-blue-100"
            textColor="text-blue-600"
            status="confirmed"
            onClick={handleFilterClick}
          />
          <StatCard
            icon={<CheckCircle />}
            value={stats.completed}
            label="Completed"
            bgColor="bg-green-100"
            textColor="text-green-600"
            status="completed"
            onClick={handleFilterClick}
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={<DollarSign />}
            value={stats.revenue}
            label="Revenue"
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
            isRevenue={true}
            trend={10}
          />
          <StatCard
            icon={<XCircle />}
            value={stats.cancelled}
            label="Cancelled"
            bgColor="bg-red-100"
            textColor="text-red-600"
            status="cancelled"
            onClick={handleFilterClick}
          />
        </div>

        {/* Appointments Table - Display Only */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Recent Appointments
                  </h2>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {filteredAppointments.length}
                  </span>
                </div>
                
                <button
                  onClick={() => navigate('/appointments')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex w-30 items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {showFilters ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterClick(status)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors
                      ${filterStatus === status 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Table Content - Read Only */}
          <div className="divide-y divide-gray-100">
            {filteredAppointments.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No appointments</h3>
                <p className="text-xs text-gray-500">
                  No appointments match the current filter
                </p>
              </div>
            ) : (
              filteredAppointments.map((item, index) => {
                const isExpanded = expandedCard === item._id;
                
                return (
                  <div
                    key={item._id || index}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Mobile Card Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
                            </h3>
                            <StatusBadge item={item} />
                          </div>
                          <p className="text-xs text-gray-600">{item.userName}</p>
                        </div>
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : item._id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Basic Info Always Visible */}
                      <div className="text-xs text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span>
                            {slotDateFormat(item.date)} • {item.time}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="space-y-3 mb-3">
                          {/* Contact Info */}
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="truncate">{item.userEmail}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              <span>{item.userPhone}</span>
                            </div>
                            {item.clientNotes && (
                              <div className="flex items-start">
                                <NotebookPen className="w-3 h-3 mr-1 text-gray-400 mt-0.5" />
                                <span className="text-xs">{item.clientNotes}</span>
                              </div>
                            )}
                          </div>
      
                          {/* Payment Info */}
                          {item.payment && (
                            <div>
                              <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.payment.status === 'paid' 
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : item.payment.status === 'failed'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}>
                                <DollarSign className="w-3 h-3 mr-1" />
                                {item.payment.status.toUpperCase()} - ${item.payment.amount}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View Only Action */}
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <button
                          onClick={() => navigate(`/appointments/${item._id}`)}
                          className="p-1.5 rounded-lg border text-blue-600 border-blue-200 hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
                            </h3>
                            <StatusBadge item={item} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1 text-gray-400" />
                              <span>{item.userName}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="truncate">{item.userEmail}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              <span>{item.userPhone}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              <span>
                                {slotDateFormat(item.date)} • {item.time}
                              </span>
                            </div>
                          </div>
                          
                          {item.payment && (
                            <div className="mt-2">
                              <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.payment.status === 'paid' 
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : item.payment.status === 'failed'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}>
                                <DollarSign className="w-3 h-3 mr-1" />
                                {item.payment.status.toUpperCase()} - ${item.payment.amount}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* View Only Action */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/appointments/${item._id}`)}
                            className="p-2 rounded-lg border text-gray-600 border-gray-200 hover:bg-gray-50"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;