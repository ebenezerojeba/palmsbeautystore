import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Footer from './components/Footer'
import Appointment from './pages/Appointment'
import MyAppointment from './pages/MyAppointment'
import { ToastContainer } from 'react-toastify';
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Collection from './pages/Collection'
import ServicesPage from './pages/ServicesPage'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import Orders from './pages/MyOrders'
import VerifyAppointment from './pages/VerifyAppointment'
import SuccessPage from './pages/SuccessPage'



const App = () => {


  const handleOldVerifyRoute = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const pathParts = window.location.pathname.split('/');
  const appointmentId = pathParts[pathParts.length - 1];
  
  if (sessionId && appointmentId) {
    window.location.href = `/verify-payment?appointmentId=${appointmentId}&sessionId=${sessionId}`;
  } else {
    window.location.href = '/appointment/error?message=Invalid verification URL';
  }
}


  
  return (
    <div className=''>
      <ToastContainer />
      <Navbar />
      <div className='mx-4 sm:mx-[-2%]'>


        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/services" element={<Services />} />
          <Route path="/servicespage" element={<ServicesPage />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/cart" element={<Cart />} /> */}

          <Route path="/contact" element={<Contact />} />
          <Route path="/collections" element={<Collection />} />
          <Route path="/appointment/:id" element={<Appointment />} />
          <Route path="/appointment/verify/:appointmentId" element={<div>{handleOldVerifyRoute()}</div>} />

          
          
          <Route
            path="/appointment/verify/:appointmentId"
            element={<VerifyAppointment />}
          />
           <Route path="/verify-payment" element={<VerifyPayment />} />
          
<Route path="/success/:appointmentId" element={<SuccessPage />} />

          {/* <Route path="/success/:appointmentId" element={<SuccessPage />} /> */}

          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/place-order' element={<PlaceOrder />} />

          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-orders' element={<Orders />} />
          <Route path="/my-appointments" element={<MyAppointment />} />
        </Routes>
        
      </div>
      <Footer />
    </div>
  )
}

export default App