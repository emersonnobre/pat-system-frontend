import { useLayoutEffect, useState } from "react"
import { Box, Button, TextField } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Edit } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import SideMenu from "../../components/SideMenu"
import processService from "../../api/process.service"
import { secondary } from "../../utils/colors"
import "./index.css"
import { formatToLocaleString } from "../../utils/datetime"
import { useForm } from "react-hook-form"

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
  const { register, handleSubmit, reset } = useForm()
  const [processes, setProcesses] = useState({
    data: [],
    totalCount: 0
  })
  const [pageOptions, setPageOptions] = useState({
    pageSize: 10,
    page: 0,
  })
  const [filters, setFilters] = useState("")
  const [sort, setSort] = useState({
    field: "prescription_date",
    sort: "asc",
  })

  const handleSort = (data) => {
    let sortObj = {
      field: "prescription_date",
      sort: "asc",
    }

    if (data[0]?.field)
      sortObj.field = data[0].field
    if (data[0]?.sort)
      sortObj.sort = data[0].sort

    setSort(sortObj)

    const token = localStorage.getItem("token")
    processService.get(token, pageOptions.pageSize, pageOptions.page * pageOptions.pageSize, sortObj.field, sortObj.sort, filters)
      .then(result => {
        setProcesses({ data: formatProcesses(result.data), totalCount: result.totalCount })
      })
  }

  const handleFilter = (filter) => {
    let filterString = ''
    if (filter.judgeName)
      filterString += `&judgeName=${filter.judgeName}`
    if (filter.executed)
      filterString += `&executedName=${filter.executed}`

    setFilters(filterString)
    const token = localStorage.getItem("token")
    processService.get(token, pageOptions.pageSize, pageOptions.page * pageOptions.pageSize, sort.field || "prescription_date", sort.sort || "asc", filterString)
      .then(result => {
        setProcesses({ data: formatProcesses(result.data), totalCount: result.totalCount })
      })
      .catch(err => {
        if (err.status == 404)
          setProcesses({ data: [], totalCount: 0 })
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
        <Box width={"100%"} display={"flex"} justifyContent={"center"} marginBottom={"30px"}>
          <form onSubmit={handleSubmit(handleFilter)} style={{ display: "flex", gap: 10 }}>
            <TextField label="Nome do juíz" variant="outlined" size="small" type="text" {...register("judgeName")} />
            <TextField label="Nome do(s) executado(s)" variant="outlined" size="small" type="text" {...register("executed")} />
            <Button variant="contained" color="secondary" type="submit" style={{ color: "#fff" }}><strong>Pesquisar</strong></Button>
            <Button variant="contained" color="primary" type="button" onClick={() => {handleFilter(""); reset()}} style={{ color: "#fff" }}><strong>Limpar filtros</strong></Button>
          </form>
        </Box>
        <Box height={635} width={"90%"}>
          <DataGrid
            columns={columns}
            rows={[...processes.data,]}
            paginationModel={pageOptions}
            onPaginationModelChange={setPageOptions}
            pageSizeOptions={[5, 10]}
            rowCount={processes.totalCount}
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