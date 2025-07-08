import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AllAppointment from './pages/AllAppointment'
import Dashboard from './pages/Dashboard'
import AdminHome from './pages/AdminHome'
import {Routes, Route} from "react-router-dom"
import Clients from './pages/Clients'
import Services from './pages/Services'
import { ToastContainer } from 'react-toastify';
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import { useState } from 'react'
import { useEffect } from 'react'
import Login from './pages/Login'

export const backendUrl = 'http://localhost:3000/'
const App = () => {

    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):"");

  useEffect(()=>{
    localStorage.setItem('token', token)
  }, [token])
  return (
    <div>
    <ToastContainer />
      {token === "" ? <Login setToken={setToken}/> : <>
<Navbar setToken = {setToken}/>
<hr />
        <Sidebar />
       <Routes>
  <Route path="/" element={<AdminHome token={token} />} />
  <Route path="/dashboard" element={<Dashboard token={token} />} />
  <Route path="/appointments" element={<AllAppointment token={token} />} />
  <Route path="/clients" element={<Clients token={token} />} />
  <Route path="/services" element={<Services token={token} />} />
  <Route path="/add" element={<Add token={token} />} />
  <Route path="/list" element={<List token={token} />} />
  <Route path="/orders" element={<Orders token={token} />} />
</Routes>

      </>}
    </div>
  )
}

export default App