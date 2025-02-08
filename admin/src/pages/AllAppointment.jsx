import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/adminContext'
import { useEffect } from 'react'

const AllAppointment = () => {
  const {appointments, getAllAppointments, setAppointments} = useContext(AdminContext)
  
  useEffect(()=>{
    getAllAppointments()
  },[])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded etxt-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col'>
          <p>#</p>
          <p>Customer Name</p>
          <p>Services</p>
          <p>Date & TIme</p>
          <p>Phone</p>
          <p>Actions</p>
          
        </div>
      {appointments.map((item,index)=>(
        <div className='flex felx-wrap justify-between max-sm:gap-2 sm:grid-cols-[.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
          <p className='max-sm:hidden'>{index + 1}</p>
          
        </div>
      ))}
      </div>
    </div>
  )
}

export default AllAppointment