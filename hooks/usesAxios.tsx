import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { AxiosContext } from '../context/AxiosContext'

export default function useAxios() {
  return useContext(AxiosContext)
}
