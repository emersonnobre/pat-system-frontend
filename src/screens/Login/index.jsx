import { TextField, Box, Button, } from "@mui/material"
import { useForm } from "react-hook-form"
import logo from "../../assets/Logo-PGE.png"
import userService from "../../api/user.service"
import { useState } from "react"
import AlertNotification from "../../components/AlertNotification.jsx"
import { useAuth } from "../../contexts/auth.context.jsx"

function LoginScreen() {
  const { register, handleSubmit, } = useForm()
  const [errorMessage, setErrorMessage] = useState(null)
  const { login } = useAuth()

  const onSubmit = async (data) => {
    setErrorMessage(null)
    try {
      const token = await userService.authenticate(data.email, data.password)
      login(token)
    } catch (error) {
      console.log("Erro ao autenticar usuário: ", error)
      setErrorMessage(error.message)
    }
  }

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      height={"100vh"}
      width={"100vw"}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        marginTop={"100px"}
      >
        <Box textAlign={"center"} color={"#f48120"}>
          <h2>PATSearch</h2>
        </Box>
          <Box display={"flex"} bgcolor={"#1E3E58"} borderRadius={"5px"} sx={{ boxShadow: '2px 3px 5px rgba(0, 0, 0, 0.1)' }}>
            <Box padding={"30px"} display={"flex"} alignItems={"center"}>
              <img src={logo} width={"200px"} height={"115px"} />
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display={"flex"} flexDirection={"column"} gap={2} bgcolor={"white"} padding={"30px"}>
                <TextField label="E-mail" variant="outlined" size="small" type="email" {...register("email")} />
                <TextField label="Senha" variant="outlined" size="small" type="password" {...register("password")} />
                <Button variant="contained" color="secondary" type="submit" ><strong>Entrar</strong></Button>
              </Box>
            </form>
          </Box>
      </Box>
      <Box bgcolor={"#1E3E58"} color={"white"} textAlign={"center"}>
        <p>
          <strong style={{ color: "#f48120" }}>PROCURADORIA-GERAL DO ESTADO</strong>
          <br/>Av. Des. José Nunes da Cunha S/N Parque dos Poderes Bloco IV Campo Grande | MS CEP: 79031-310</p>
      </Box>
      {errorMessage && (<AlertNotification key={new Date()} message={errorMessage} />)}
    </Box>
  )
}

export default LoginScreen