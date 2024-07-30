import { useLayoutEffect, useState } from "react"
import { Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Edit } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import SideMenu from "../../components/SideMenu"
import processService from "../../api/process.service"
import { secondary } from "../../utils/colors"
import "./index.css"
import { formatToLocaleString } from "../../utils/datetime"

function formatProcesses(processes) {
  return processes.map(process => {
    return {
      ...process,
      distribution: `${formatToLocaleString(new Date(process.distribution))} ${new Date(process.distribution).toLocaleTimeString()}`,
      prescription_date: formatToLocaleString(process.prescription_date),
    }
  })
}

function Home() {
  const navigate = useNavigate()
  const [processes, setProcesses] = useState({
    data: [],
    totalCount: 0
  })
  const [pageOptions, setPageOptions] = useState({
    pageSize: 10,
    page: 0,
  })

  const handleSort = (data) => {
    const token = localStorage.getItem("token")
    processService.get(token, pageOptions.pageSize, pageOptions.page * pageOptions.pageSize, data[0]?.field || "prescription_date", data[0]?.sort || "asc")
      .then(result => {
        setProcesses({ data: formatProcesses(result.data), totalCount: result.totalCount })
      })
  }

  useLayoutEffect(() => {
    const token = localStorage.getItem("token")
    processService.get(token, pageOptions.pageSize, pageOptions.page * pageOptions.pageSize, "prescription_date", "asc")
      .then(result => {
        setProcesses({ data: formatProcesses(result.data), totalCount: result.totalCount })
      })
  }, [pageOptions])

  const columns = [
    { field: 'number', headerName: 'Número', flex: 1, sortable: true, resizable: false, headerClassName: 'header-class', },
    { field: 'judge_name', headerName: 'Nome do juíz', flex: 1, resizable: false, headerClassName: 'header-class', },
    { field: 'distribution', headerName: 'Data da distribuição', flex: 1, resizable: false, headerClassName: 'header-class', },
    { field: 'prescription_date', headerName: 'Data da prescrição', flex: 1, resizable: false, headerClassName: 'header-class', },
    { field: 'civil_court', headerName: 'Vara', flex: 1, resizable: false, headerClassName: 'header-class', },
    { field: 'executed', headerName: 'Executado(s)', flex: 1, resizable: false, headerClassName: 'header-class', },
    { field: 'actions', headerName: 'Ações', flex: 1, resizable: false, headerClassName: 'header-class', sortable: false, 
      renderCell: (params) => { return <Edit onClick={() => navigate("/process/"+params.id)} sx={{ cursor: "pointer" }} color="primary" /> } 
    },
  ];

  return (
    <SideMenu>
      <Box width={"100vw"} 
           display={"flex"} 
           flexDirection={"column"} 
           alignItems={"center"}
           color={secondary}
      >
        <h2>Processos próximos da data de prescrição</h2><br />
        <Box height={635} width={"90%"}>
          <DataGrid
            columns={columns}
            rows={[...processes.data,]}
            paginationModel={pageOptions}
            onPaginationModelChange={setPageOptions}
            pageSizeOptions={[5, 10]}
            rowCount={20}
            paginationMode="server"
            disableColumnMenu
            onSortModelChange={handleSort}
            sortingMode="server"
          />
        </Box>
      </Box>
    </SideMenu>
  )
}

export default Home