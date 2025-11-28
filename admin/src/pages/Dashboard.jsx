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

// Loading Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="bg-gray-200 p-2 rounded-lg">
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded"></div>
      </div>
      <div className="w-8 h-3 bg-gray-200 rounded"></div>
    </div>
    <div>
      <div className="h-6 bg-gray-300 rounded w-12 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const AppointmentRowSkeletonMobile = () => (
  <div className="p-4 animate-pulse">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="w-6 h-6 bg-gray-200 rounded"></div>
    </div>
    <div className="flex items-center mb-2">
      <div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="flex items-center justify-end">
      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const AppointmentRowSkeletonDesktop = () => (
  <div className="p-4 animate-pulse">
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <div className="h-5 bg-gray-200 rounded-full w-28"></div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

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
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load dashboard data and appointments on mount
    const loadData = async () => {
      try {
        setIsLoading(true);
        setStatsLoading(true);
        setAppointmentsLoading(true);
        
        const promises = [];
        
        // Load stats
        if (getDashData) {
          promises.push(
            getDashData().then(() => {
              setStatsLoading(false);
            }).catch(error => {
              console.error('Error loading dashboard stats:', error);
              setStatsLoading(false);
            })
          );
        } else {
          setStatsLoading(false);
        }
        
        // Load appointments
        if (getAllAppointments) {
          promises.push(
            getAllAppointments().then(() => {
              setAppointmentsLoading(false);
            }).catch(error => {
              console.error('Error loading appointments:', error);
              setAppointmentsLoading(false);
            })
          );
        } else {
          setAppointmentsLoading(false);
        }
        
        await Promise.allSettled(promises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
        setStatsLoading(false);
        setAppointmentsLoading(false);
      }
    };
    
    loadData();
  }, []); // Empty dependency array - only run once on mount

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
          {statsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* <Calendar className="w-4 h-4 text-gray-500" /> */}
                  <h2 className="text-base font-semibold text-gray-900">
                    Recent Appointments
                  </h2>
                  {!appointmentsLoading && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {filteredAppointments.length}
                    </span>
                  )}
                  {appointmentsLoading && (
                    <div className="w-6 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                  )}
                </div>
                
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex w-10 items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  disabled={appointmentsLoading}
                >
                  {/* <Filter className="w-4 h-4" /> */}
                  {/* <span>Filter</span> */}
                  {showFilters ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            {showFilters && !appointmentsLoading && (
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
            
            {/* Filter Pills Skeleton */}
            {showFilters && appointmentsLoading && (
              <div className="mt-3 flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-100">
            {appointmentsLoading ? (
              // Loading skeletons
              <>
                {/* Mobile Skeletons */}
                <div className="sm:hidden">
                  {[...Array(3)].map((_, i) => (
                    <AppointmentRowSkeletonMobile key={i} />
                  ))}
                </div>
                
                {/* Desktop Skeletons */}
                <div className="hidden sm:block">
                  {[...Array(3)].map((_, i) => (
                    <AppointmentRowSkeletonDesktop key={i} />
                  ))}
                </div>
              </>
            ) : filteredAppointments.length === 0 ? (
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
                                {item.payment.status.toUpperCase()} - ${Math.round(item.payment.amount / 2)}
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