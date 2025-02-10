const ActionButton = ({ icon, onClick, label }) => (
    <button
      onClick={onClick}
      className="p-1 rounded-full hover:bg-gray-100 transition-colors bg-gray-200"
      title={label}
    >
      {icon}
    </button>
  );

  export default ActionButton