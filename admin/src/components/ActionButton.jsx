const ActionButton = ({ icon, onClick, label, color }) => (
    <button
      onClick={onClick}
      className={`p-1 rounded-full ${color} hover:bg-gray-100 transition-colors cursor-pointer`}
      title={label}
    >
      {icon}
    </button>
  );

  export default ActionButton