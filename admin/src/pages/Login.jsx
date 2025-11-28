import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Loader2 } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Login = ({ setToken }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    // const {backendUrl} = useContext(AdminContexts);
    const onSubmitHandler = async (e) => {
           // Client-side validation
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setIsLoading(true)
            e.preventDefault();
            const response = await axios.post(backendUrl + "/api/user/admin", { email, password })
            if (response.data.success) {
                setToken(response.data.token)
                    toast.success("Login successful!")
            } else {
                toast.error(response.data.message || "Login failed. Please try again.")
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
        <div className='min-h-screen flex items-center justify-center w-full bg-gray-50 px-4'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler} noValidate>
                    <div className='mb-3 w-full'>
                        <label htmlFor="email" className='text-sm font-medium text-gray-700 mb-2 block'>
                            Email Address
                        </label>
                        <input 
                            id="email"
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed' 
                            type="email" 
                            placeholder='your@gmail.com'
                            required
                            autoComplete="email"
                            disabled={isLoading}
                        />
                    </div>
                    <div className='mb-3 w-full'>
                        <label htmlFor="password" className='text-sm font-medium text-gray-700 mb-2 block'>
                            Password
                        </label>
                        <input 
                            id="password"
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed' 
                            type="password" 
                            placeholder='Enter your password'
                            required
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2' 
                        type='submit' 
                        disabled={isLoading}
                        aria-label={isLoading ? "Logging in..." : "Login"}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login

