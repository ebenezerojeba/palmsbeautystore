import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AdminContextsProvider from "./context/AdminContexts.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  {/* <AuthProvider> */}
    <AdminContextsProvider>
      <App />
    </AdminContextsProvider>
  {/* </AuthProvider> */}
  </BrowserRouter>
);