import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { AxiosContext } from './AxiosContext'

const { authAxios, publicAxios } = useContext(AxiosContext)
const { authState, getAccessToken, logout, setAuthState } = useContext(
  AuthContext,
)

export const useAuth = () => useContext(AuthContext)
export const useAxios = () => useContext(AxiosContext) // { authAxios, publicAxios }
/* export const useAuth = () => ({
  authState,
  getAccessToken,
  logout,
  setAuthState,
}) */
