import { useState } from 'react'
import { createContext } from 'react'

import * as SecureStore from 'expo-secure-store'


export interface IAuthState {
    accessToken: string,
    authenticated: boolean
}

export type AuthContextType = {
    authState: IAuthState,
    setAuthState: (authState: IAuthState) => void,
    getAccessToken: () => void,
    logout: () => void
}

const initialData: AuthContextType = {
    authState: {
        accessToken: "",
        authenticated: false
    },
    setAuthState: () => '',
    getAccessToken: () => "",
    logout: () => ""
    //accessToken: "",
    ///authenticated: false
}

interface Props {
    children?: React.ReactNode
}

export const AuthContext = createContext<AuthContextType>(initialData)

export const AuthProvider: React.FC<Props> = ( {children} ) => {
    const [authState, setAuthState] = useState<IAuthState>(initialData.authState)
    const getAccessToken = () => authState.accessToken
    const logout = async () => {
        await SecureStore.deleteItemAsync('refreshToken')
        setAuthState({
            accessToken: "",
            authenticated: false,
        })
    }
    return (
        <AuthContext.Provider value={{ authState, setAuthState, getAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContext