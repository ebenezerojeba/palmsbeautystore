import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import ServicesPage from './pages/ServicesPage';
import Appointment from './pages/Appointment';
import MyAppointment from './pages/MyAppointment';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Collection from './pages/Collection';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import Orders from './pages/MyOrders';
import VerifyAppointment from './pages/VerifyAppointment';
import SuccessPage from './pages/SuccessPage';
import MyAppointmentsWithErrorBoundary from './pages/MyAppointment';
import Success from './pages/SuccessOrder';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <ToastContainer />
      <Navbar />

      {/* Main content wrapper */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/services" element={<Services />} />
            <Route path="/servicespage" element={<ServicesPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/collections" element={<Collection />} />
            <Route path="/appointment/:id" element={<Appointment />} />
            <Route path="/appointment/verify" element={<VerifyAppointment />} />
            <Route path="/success/:appointmentId" element={<SuccessPage />} />
            <Route path="/order-success" element={<Success />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-orders" element={<Orders />} />
            <Route path="/my-appointments" element={<MyAppointment />} />
            {/* <Route path="/my-appointments" element={<MyAppointmentsWithErrorBoundary />} /> */}
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;




// import React from 'react'

// const App = () => {
//   return (
//   <div className="flex justify-center items-center h-screen">
//   <div className="text-center text-2xl m-10 p-10">
//     Palmsbeauty Store...
//   </div>
// </div>

//   )
// }

// export default App