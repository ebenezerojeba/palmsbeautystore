import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { AppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const location = useLocation();
  const { category, scrollY } = location.state || {};

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (category) setExpanded(prev => ({ ...prev, [category]: true }));
    if (scrollY !== undefined) window.scrollTo({ top: scrollY, behavior: "smooth" });
  }, [category, scrollY]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/services/publicservices`);
      setServices(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpanded(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleBook = (service) => {
    navigate(`/appointment/${service._id}`, { state: { service } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-lg font-medium">Error loading services: {error}</p>
        <button
          onClick={fetchServices}
          className="mt-6 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 flex justify-end">
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No service available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {services.map((category) => {
            const filteredSubServices = category.subServices?.filter((service) =>
              service.title.toLowerCase().includes(searchQuery.toLowerCase())
            ) || [];

            if (filteredSubServices.length === 0) return null;

            return (
              <div key={category._id} className='bg-gray-50 border-b border-gray-100 pb-2 mb-6'>
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="flex items-center gap-2 w-full text-left text-lg font-semibold text-gray-800 hover:text-gray-600 transition-all"
                >
                  {expanded[category._id] ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <span>{category.title}</span> 
                </button>

                {expanded[category._id] && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mt-6 sm:text-sm">
                    {filteredSubServices.map((service) => (
                      <ServiceCard
                        key={service._id}
                        title={service.title}
                        description={service.description}
                        duration={service.duration}
                        price={service.price}
                        image={service.image}
                        isActive={service.isActive}
                        onBook={() => handleBook(service)}
                        categoryId={category._id}
                        serviceId={service._id}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Services;
