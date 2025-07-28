import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import {toast} from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = (props) => {
const backendUrl = "http://localhost:3000"
// const backendUrl = "https://palmsbeautystore-backend.onrender.com"
      const [userData, setUserData] = useState(false)
    const [isLoggedIn, setIsLoggedin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): "")

   
const loadUserProfileData = async () => {
  try {
    // Get token from localStorage (or your auth context)
    const token = localStorage.getItem('token'); // or from context
    
    if (!token) {
      toast.error("Please login first");
      return;
    }

    const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
      headers: { 
        Authorization: `Bearer ${token}` // ✔️ Proper header format
      }
    });

    if (data.success) {
      console.log("User data loaded:", data.userData);
      setUserData(data.userData);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Profile load error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to load profile");
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
};

    // const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const backendUrl = "https://palmsbeautystore-backend.onrender.com"
// const backendUrl = "https://palmsbeauty-backend.vercel.app";
    const value = {
        
        backendUrl,
        userData,setUserData,isLoggedIn,setIsLoggedin,loadUserProfileData,token,setToken
        
    }
 
   useEffect(()=>{
    if (token) {
      loadUserProfileData()
    }
    else{
      setUserData(false)
    }
  },[token])

     
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider


