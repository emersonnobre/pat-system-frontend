import { Box } from "@mui/material"
import { Home as HomeIcon, Search, Logout } from "@mui/icons-material"
import { primary, secondary } from "../utils/colors"
import "./index.css"

function SideMenu({ children }) {
  return (
    <Box display={"flex"}>
      <Box 
        bgcolor={primary} 
        display={"flex"} 
        flexDirection={"column"} 
        alignItems={"center"} 
        height={"100vh"} 
        width={"15vw"}
        paddingTop={"20px"}
      >
        <Box flex={1} color={secondary}>
          <h2>PATSearch</h2>
        </Box>
        <Box flex={9} width={"100%"}>
          <div className="menu-item">
            <HomeIcon />
            <div>
              <p>Tela inicial</p>
            </div>
          </div>
          <div className="menu-item">
            <Search />
            <div>
              <p>Buscar processos</p>
            </div>
          </div>
          <div className="menu-item">
            <Logout />
            <div>
              <p>Encerrar sessão</p>
            </div>
          </div>
        </Box>
      </Box>
      <Box width={"90vw"} padding={"15px"}>
        {children}
      </Box>
    </Box>
  )
}

export default SideMenu