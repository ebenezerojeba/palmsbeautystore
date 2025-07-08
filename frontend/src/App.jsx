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



const App = () => {
  return (
    <div className='mx-4 sm:mx-[-2%]'>
       <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collections" element={<Collection />} />
        <Route path="/appointment/:id" element={<Appointment />} />
        
        <Route path='/product/:productId' element={<Product />}/>
        <Route path='/cart' element={<Cart />}/>
        <Route path='/place-order' element={<PlaceOrder />}/>
        <Route path="/my-appointments" element={<MyAppointment />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App