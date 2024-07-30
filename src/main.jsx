import React from "react"
import ReactDOM from "react-dom/client"
import { createTheme, ThemeProvider } from "@mui/material"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import "./index.css"
import { AuthProvider, useAuth } from "./contexts/auth.context.jsx"
import LoginScreen from "./screens/Login/index.jsx"
import Home from "./screens/Home/index.jsx"
import Process from "./screens/Process/index.jsx"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E3E58",
    },
    secondary: {
      main: "#f48120"
    },
    info: {
      main: "#9db8d4"
    },
    success: {
      main: "#198754",
      "100": "#c5ead5",
      "200": "#9fddbb",
    },
  }
})

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const { token } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      {!token && <Route path="*" element={<Navigate to="/login" replace />} />}
      <Route path="/home" element={<Home />} />
      <Route path="/process/:id" element={<Process />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
