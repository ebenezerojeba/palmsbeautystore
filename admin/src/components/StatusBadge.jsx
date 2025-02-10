import React from "react";

// Helper component
const StatusBadge = ({ item }) => {
    if (item.isCancelled) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    }
    if (item.isCompleted) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
        Pending
      </span>
    );
  };

  export default StatusBadge;