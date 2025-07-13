import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]); // array of categories
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext); // Assuming you have a context for the backend URL

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/services/publicservices`);
      setServices(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

const handleBook = (service) => {
    navigate(`/appointment/${service._id}`);
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading services: {error}</p>
        <button
          onClick={fetchServices}
          className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Service</h1>

      <div className="max-w-md mx-auto mb-6">
  <input
    type="text"
    placeholder="Search services..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none "
  />
</div>


      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No service available at the moment.</p>
        </div>
      ) : (
           <div className="space-y-8">
          {services.map((category) => {
            const filteredSubServices = category.subServices.filter((service) =>
              service.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredSubServices.length === 0) return null;

            return (
              <div key={category._id}>
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="flex items-center justify-between w-full text-left text-2xl font-semibold mb-4 text-gray-900 focus:outline-none"
                >
                  <span>{category.title}</span>
                  {expanded[category._id] ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>

                {expanded[category._id] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
