import { createContext } from 'react'

export const AppContext = createContext()

const AppContextProvider = (props) => {


    // const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const backendUrl = "http://localhost:3000"
const backendUrl = "https://palmsbeautystore-backend.onrender.com"
// const backendUrl = "https://palmsbeauty-backend.vercel.app";
    const value = {
        
        backendUrl,
        
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider


