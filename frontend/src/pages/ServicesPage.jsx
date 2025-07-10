import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/services`);
        // Organize into hierarchy
        const categories = data.services.filter(s => s.isCategory);
        const serviceMap = {};
        
        categories.forEach(cat => {
          serviceMap[cat._id] = {
            ...cat,
            subServices: data.services.filter(s => s.parentService === cat._id)
          };
        });
        
        setServices(serviceMap);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Services Menu */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <ul className="space-y-2">
            {Object.values(services).map(category => (
              <li key={category._id}>
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-100 rounded"
                >
                  <span>{category.title}</span>
                  {expandedCategories[category._id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedCategories[category._id] && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {category.subServices.map(service => (
                      <li key={service._id}>
                        <a 
                          href={`#service-${service._id}`}
                          className="block p-2 hover:bg-gray-100 rounded"
                        >
                          {service.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Services Content */}
        <div className="md:col-span-3">
          {Object.values(services).map(category => (
            <div key={category._id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.subServices.map(service => (
                  <div 
                    key={service._id} 
                    id={`service-${service._id}`}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{service.duration}</span>
                      <span className="font-semibold">{service.price}</span>
                    </div>
                    <button className="mt-4 w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;