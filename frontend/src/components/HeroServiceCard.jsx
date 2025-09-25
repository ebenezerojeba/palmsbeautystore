import { useNavigate } from "react-router-dom";

const ServiceCard = ({ title, description, image, price, features, icon: Icon, delay }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 border border-neutral-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-neutral-800" />
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">
            {price}
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-light text-neutral-900 mb-4 tracking-wide">{title}</h3>
        <p className="text-neutral-600 mb-6 leading-relaxed">{description}</p>
        
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-1 h-1 bg-neutral-400 rounded-full" />
              <span className="text-sm text-neutral-600">{feature}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => navigate("/services")}
          className="w-full bg-pink-900 text-white cursor-pointer py-3 rounded-xl font-medium hover:bg-pink-800 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
