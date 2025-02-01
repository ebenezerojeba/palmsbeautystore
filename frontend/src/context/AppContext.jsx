import { createContext } from 'react'
import {braidingServices, doctors} from '../assets/assets'

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const value = {
        braidingServices
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider