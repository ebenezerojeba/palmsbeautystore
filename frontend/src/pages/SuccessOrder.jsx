import React, { useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Check, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Check className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Payment Successful
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Thank you for your order. A confirmation email has been sent to you.
      </p>
      {/* <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        Continue Shopping
      </button> */}
    </div>
  );
};

export default Success;
