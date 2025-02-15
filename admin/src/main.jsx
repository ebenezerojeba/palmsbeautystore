import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AdminContextsProvider from "./context/AdminContexts.jsx";
// import AdminContextProvider from "./context/adminContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextsProvider>
      <App />
    </AdminContextsProvider>
  </BrowserRouter>
);