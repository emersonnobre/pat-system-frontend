import { Navigate, Outlet, useLocation } from "react-router-dom"
import "./App.css"
import { useAuth } from "./contexts/auth.context"

function PrivateRoutes() {
  const { token } = useAuth()
  const location = useLocation()

  return token ? (<Outlet />) : <Navigate to={"/login"} state={{ from: location }} replace />
}

export default PrivateRoutes
