import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import {toast} from "react-toastify"

export const AppContext = createContext()


const AppContextProvider = (props) => {
 const backendUrl = import.meta.env.VITE_BACKEND_URL;
//  console.log('BACKEND URL:', backendUrl);



      const [userData, setUserData] = useState(false)
    const [isLoggedIn, setIsLoggedin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): "")

   
const loadUserProfileData = async () => {
  try { 
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

   useEffect(()=>{
    if (token) {
      loadUserProfileData()
    }
    else{
      setUserData(false)
    }
  },[token])

    const value = { 
        backendUrl,
        userData,setUserData,isLoggedIn,setIsLoggedin,loadUserProfileData,token,setToken
        
    }

     
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider


