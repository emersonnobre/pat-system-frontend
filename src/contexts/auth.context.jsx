/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext({
  token: null,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken)
      setToken(storedToken)
  }, [])

  useEffect(() => {
    console.log('atualizou estado!', token)
  }, [token])

  const login = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    navigate("/home")
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}