import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AllAppointment from './pages/AllAppointment'
import Dashboard from './pages/Dashboard'
import {Routes, Route} from "react-router-dom"
import Clients from './pages/Clients'
import Services from './pages/Services'

import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div>
      <Navbar/>

      <div className='flex items-start'>
      <ToastContainer />
        <Sidebar />
        <Routes>
          <Route path="/" element={<> </>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<AllAppointment />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </div>
          </div>
  )
}

export default App