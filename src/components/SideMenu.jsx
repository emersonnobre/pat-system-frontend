import { Box } from "@mui/material"
import "./index.css"

function SideMenu({ children }) {
  return (
    <Box display={"flex"}>
      <Box width={"100vw"}>
        {children}
      </Box>
    </Box>
  )
}

export default SideMenu