const ServiceNavigation = ({ activeSection, setActiveSection }) => {
    const sections = [
      { id: 'hair', label: 'Hair & Braiding' },
      { id: 'beauty', label: 'Beauty Services' }
    ];
  
    return (
      <div className="flex justify-center space-x-4 mb-12">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-6 py-2 rounded-full transition-all ${
              activeSection === section.id
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    );
}
    export default ServiceNavigation