const SectionTitle = ({ children }) => (
    <div className="relative text-center mb-12">
      <h2 className="text-3xl font-semibold text-gray-800 inline-block">
        {children}
      </h2>
      <div className="absolute w-24 h-1 bg-gray-300 bottom-0 left-1/2 transform -translate-x-1/2 -mb-4"></div>
    </div>
  );

  export default SectionTitle