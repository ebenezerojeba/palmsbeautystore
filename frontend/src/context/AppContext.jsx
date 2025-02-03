import { createContext } from 'react'
import {braidingServices, doctors} from '../assets/assets'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = "http://localhost:3000"

    const value = {
        braidingServices,
        backendUrl
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider