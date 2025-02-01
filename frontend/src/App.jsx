import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'


const App = () => {
  return (
    <div className='mx-4 sm:mx-[-2%]'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      
    </div>
  )
}

export default App