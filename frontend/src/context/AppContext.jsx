import { createContext } from 'react'
import {beautyServices, braidingServices, doctors} from '../assets/assets'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = "http://localhost:3000"
    // const backendUrl = "https://palmsbeauty-backend.vercel.app"
    // const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const value = {
        braidingServices,
        backendUrl,
        beautyServices
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider