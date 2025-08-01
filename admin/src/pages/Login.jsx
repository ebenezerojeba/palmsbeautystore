import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Loader2 } from "lucide-react";


const backendUrl = "https://palmsbeautystore-backend.onrender.com"

const Login = ({setToken}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    // const {backendUrl} = useContext(AdminContexts);
    const onSubmitHandler = async (e) => {
        try {
             setIsLoading(true)
            e.preventDefault();
            const response = await axios.post(backendUrl + "/api/user/admin", {email,password})
            if(response.data.success) {
                setToken(response.data.token)
            }
else{
    toast.error(response.data.message)
}
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
        finally {
            setIsLoading(false)
        }
    }
  return (
    <div className='min-h-scrren flex items-center justify-center w-full'>
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
            <form action="" onSubmit={onSubmitHandler}>
                <div  className='mb-3 min-w-72'>
                    <p className='font-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" name="" placeholder='your@gmail.com' id="" />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='font-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" name="" placeholder='Enter your password' id="" />
                </div>
                <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type='submit' disabled={isLoading}>
                    {isLoading ? <Loader2 />: "Login"}</button>
            </form>
        </div>
    </div>
  )
}

export default Login