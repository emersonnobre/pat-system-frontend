import { useLayoutEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { Info, History, PlayArrow, ArrowUpward, EditOutlined, DeleteOutline } from "@mui/icons-material"
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from "@mui/lab"
import { useForm } from "react-hook-form"
import processService from "../../api/process.service"
import { formatToLocaleString } from "../../utils/datetime"
import AlertNotification from "../../components/AlertNotification"
import { orderBy } from "../../utils/array"
import BasicModal, { DialogModal } from "../../components/Modal"
import "./style.css"
import SideMenu from "../../components/SideMenu"

function Process() {
  const { id } = useParams()
  const [process, setProcess] = useState(null)
  const [validPrescription, setValidPrescription] = useState(false)
  const [message, setMessage] = useState(null)
  const [editDocument, setEditDocument] = useState(false)
  const [open, setOpen] = useState(false)
  const [idToEdit, setIdToEdit] = useState(null)
  const [removeModalConfig, setRemoveModalConfig] = useState({
    open: false,
    cb: () => {}
  })
  const theme = useTheme()
  const { register, handleSubmit, } = useForm()

  const map = (process) => {
    return {
      ...process,
      prescription_date: formatToLocaleString(process.prescription_date),
      updated_at: formatToLocaleString(process.updated_at),
      updated_at_time: new Date(process.updated_at).toLocaleTimeString(),
      distribution: formatToLocaleString(process.distribution) + " " + new Date(process.distribution).toLocaleTimeString(),
      movements: process.movements.filter(x => x.active)
    }
  }

  useLayoutEffect(() => {
    const token = localStorage.getItem("token")
    processService.getById(token, id)
      .then(process => {
        setProcess(map(process))
        setValidPrescription(process.prescription_date_validated)
      })
  }, [id])

  const onSubmit = async (data) => {
    setMessage(null)
    try {
      const token = localStorage.getItem("token")
      await processService.updateDocument(token, id, data.document)
      setMessage("Documento do processo atualizado com sucesso!")
      setEditDocument(false)
    } catch (error) {
      console.log("Erro ao atualizar documento do processo: ", error)
      setMessage(error.message)
    }
  }

  const onSubmitValidPrescription = async (data) => {
    try {
      const token = localStorage.getItem("token")
      await processService.updateValidDatePrescription(token, id, data)
      setValidPrescription(data)
    } catch (error) {
      console.log("Erro ao atualizar validade da data de prescrição do processo: ", error)
    }
  }

  const removeMovement = (movement) => {
    try {
      const token = localStorage.getItem("token")
      processService.updateMovement(token, movement.id, movement.type, false)
      setProcess({ ...process, movements: process.movements.filter(x => x.id != movement.id) })
    } catch (error) {
      console.log("Erro ao remover movimentação: ", error)
    }
  }

  const movementIcon = (index, withBorder = false) => {
    const firstId = orderBy(process.movements, "created_at", "asc")[0].id
    const lastId = orderBy(process.movements, "created_at", "asc")[process.movements.length - 1].id
    let color = theme.palette.primary.main
    let icon = <History sx={{ color: color }} />
    let bgcolor = theme.palette.info.main
    if (index == lastId) {
      color = theme.palette.warning.main
      icon = <ArrowUpward sx={{ color }} />
      bgcolor = "#f9b175"
    }
    if (index == firstId) {
      color = theme.palette.success.main
      icon = <PlayArrow sx={{ color }} />
      bgcolor = "#9fddbb"
    }

    return <Box onClick={() => {
      const element = document.getElementById("card-box-"+index)
      if (element)
        element.scrollIntoView({ behavior: "smooth" })
      const oldClasses = element.classList.toString()
      element.classList += " destaque"
      setTimeout(() => element.classList = oldClasses, 1000)
    }} sx={{ 
      borderRadius: "100%", 
      width: "30px", 
      height: "30px", 
      display: "flex", 
      bgcolor: bgcolor, 
      alignItems: "center", 
      justifyContent: "center",
      cursor: "pointer", 
      border: withBorder ? `3px solid ${color}` : ""
    }}>
      {icon}
    </Box>
  }

  const MovementCard = ({ index, length, children }) => {
    let color = theme.palette.primary.main
    if (index == 0) {
      color = theme.palette.warning.main
    }
    if (index == length - 1) {
      color = theme.palette.success.main
    }

    return (
      <Box bgcolor={color} padding={"30px"} display={"flex"} alignItems={"center"}>
        <Typography color={"white"} fontWeight={600} variant="p">
          {children}
        </Typography>
      </Box>
    )
  }

  const getColor = (index, length) => {
    let color = theme.palette.primary.main
    if (index == 0) {
      color = theme.palette.warning.main
    }
    if (index == length - 1) {
      color = theme.palette.success.main
    }
    return color
  }

  return process ? (
    <SideMenu>
      <Box display={"flex"} justifyContent={"center"} minHeight={"100%"}>
        <Box width={"70%"} sx={{ borderRight: "1px solid #ccc" }} padding={"15px"}>
          <h2>Processo de número {process.number}</h2>

          <div className="timeline-container">
            {orderBy(process.movements, "created_at", "asc").map((movement, i) => {
              return (
                <Box key={i} display={"flex"} alignItems={"center"}>
                  <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Typography variant="p" fontWeight={500} fontSize={"12px"}>
                      {formatToLocaleString(movement.created_at)}
                    </Typography>
                    {movementIcon(movement.id)}
                    
                  </Box>
                  {i != process.movements.length - 1 && <Box borderBottom={"1px solid #ddd"} width={"300px"} height={"20px"}>
                  </Box>}
                </Box>
              )
            })}
          </div>

          <Box>
            <Timeline position="alternate">
              {process.movements.map((movement, i) => {
                return (
                  <TimelineItem key={i}>
                    <TimelineSeparator>
                      {movementIcon(movement.id, true)}
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <div id={`card-${movement.id}`} className="item" style={{ zIndex: 1 }}>
                        <Card>
                          <Box id={`card-box-${movement.id}`} display={"flex"} sx={{ transition: "opacity 0.5s ease" }}>
                              <MovementCard index={i} length={process.movements.length}>
                                {formatToLocaleString(movement.created_at)}
                              </MovementCard>
                              <Box padding={"10px"} width={"100%"}>
                                <Box borderBottom={"1px solid #eee"} marginBottom={"10px"} display={"flex"} justifyContent={"space-between"}>
                                  <Typography variant="subtitle1" fontWeight={600} color={getColor(i, process.movements.length)}>
                                    {movement.type}
                                  </Typography>
                                  <Box display={"flex"}>
                                    <Box 
                                      onClick={() => {
                                        setOpen(true)
                                        setIdToEdit(movement.id)
                                      }} 
                                      sx={{ 
                                        cursor: "pointer",
                                      }}
                                    >
                                      <EditOutlined color="primary" />
                                    </Box>
                                    <Box 
                                      onClick={() => {
                                        setRemoveModalConfig({
                                          open: true,
                                          cb: () => removeMovement(movement)
                                        })
                                      }} 
                                      sx={{ 
                                        cursor: "pointer",
                                      }}
                                    >
                                      <DeleteOutline color="error" />
                                    </Box>
                                  </Box>
                                </Box>
                                <Box padding={"10px"}>
                                  <Typography variant="p" fontSize={"13px"}>
                                    {movement.description}
                                  </Typography>
                                </Box>
                              </Box>
                          </Box>
                        </Card>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
            </Timeline>
          </Box> 
        </Box>
        <Box width={"30%"} padding={"15px"}>
          <Box borderBottom={`1px solid ${theme.palette.grey[300]}`} paddingBottom={"15px"}>
            <Card sx={{  bgcolor: theme.palette.success["200"] }}>
              <CardContent>
                <Typography fontSize={"15px"} variant="p">
                  <strong>Processo irá prescrever em {process.prescription_date}</strong>
                </Typography><br />
                <Typography fontSize={"13px"} variant="p">
                  Prescrição calculada a partir da definição da <strong>LEF</strong>.
                </Typography><br />
                <Typography fontSize={"13px"} variant="p">
                  Data de última atualização: {process.updated_at} às {process.updated_at_time}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box paddingTop={"30px"} display={"flex"} borderBottom={`1px solid ${theme.palette.grey[300]}`} paddingBottom={"15px"}>
            <Box flex={3} display={"flex"} flexDirection={"column"} justifyContent={"space-around"} gap={2}>
              <Typography fontSize={"11px"}>
                <strong>Número do processo:</strong><br /> {process.number}
              </Typography>
              <Typography fontSize={"11px"}>
                <strong>Valor da execução:</strong><br /> R${process.debt_amount}
              </Typography>
              <Typography fontSize={"11px"}>
                <strong>Área:</strong><br /> {process.subject}
              </Typography>
            </Box>
            <Box flex={4} display={"flex"} flexDirection={"column"} justifyContent={"space-around"} gap={2}>
              <Typography fontSize={"11px"}>
                <strong>Tribunal:</strong><br /> {process.court}
              </Typography>
              <Typography fontSize={"11px"}>
                <strong>Foro:</strong><br /> {process.jurisdiction}
              </Typography>
              <Typography fontSize={"11px"}>
                <strong>Controle:</strong><br /> {process.control_number}
              </Typography>
            </Box>
            <Box flex={3} display={"flex"} flexDirection={"column"} justifyContent={"space-around"} gap={2}>
              <Typography fontSize={"11px"}>
                <strong>Data da distribuição:</strong><br /> {process.distribution}
              </Typography>
              <Typography fontSize={"11px"}>
                <strong>Executado(s):</strong><br /> {process.executed}
              </Typography>
              <Typography fontSize={"11px"}>
                <strong>Juíz:</strong><br /> {process.judge_name}
              </Typography>
            </Box>
          </Box>
          <Box paddingTop={"20px"} display={"flex"} flexDirection={"column"}>
            {!validPrescription && <Button variant="outlined" color="success" onClick={() => onSubmitValidPrescription(!validPrescription)}>
              <Typography fontSize={12} fontWeight={600}>
                VALIDAR PRESCRIÇÃO
              </Typography>
            </Button>}
            <Box marginTop={"10px"} width={"100%"}>
              { validPrescription ? 
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <textarea rows={30} cols={60} color="#fff" defaultValue={process.document} {...register("document")} disabled={!editDocument} />
                    { editDocument ?
                      <Box>
                        <Button variant="outlined" color="success" type="submit">
                        <Typography fontSize={12} fontWeight={600}>
                          SALVAR
                        </Typography>
                      </Button>
                      </Box>
                       :
                       <Box>
                        <Button variant="outlined" color="info" type="button" onClick={(ev) => { ev.preventDefault(); setEditDocument(true) }}>
                        <Typography fontSize={12} fontWeight={600}>
                          EDITAR
                        </Typography>
                        </Button>
                      </Box>
                      
                    }
                  </Box>
                </form> :
                <Box bgcolor={theme.palette.info.main} 
                     display={"flex"} 
                     color={theme.palette.common.white} 
                     alignItems={"center"} 
                     gap={1} 
                     justifyContent={"center"}
                     borderRadius={"5px"}
                >
                  <Info />
                  <p>O documento é exibido após <strong>validar a data de prescrição</strong></p> 
                </Box>
              }
            </Box>
          </Box>
        </Box>
        <BasicModal open={open} setOpen={setOpen}>
          <EditMovement id={idToEdit} closeModal={() => setOpen(false)} setMessage={setMessage} process={process} />
        </BasicModal>
        <DialogModal open={removeModalConfig.open} setOpen={(open) => setRemoveModalConfig({...removeModalConfig, open})} cb={removeModalConfig.cb} />
      </Box>
      {message && (<AlertNotification key={new Date()} message={message} severity="success" />)}
    </SideMenu>
  ) : <h3>Carregando...</h3>
}

const EditMovement = ({ id, closeModal, setMessage, process }) => {
  const [type, setType] = useState(null)

  const handleChange = (event) => {
    setType(event.target.value);
  }

  const handleSubmit = () => {
    const token = localStorage.getItem("token")
    if (!type) {
      const element = document.getElementById("type-select")
      element.classList.add("error-border")
      return
    }
    processService.updateMovement(token, id, type, true)
      .then(() => {
        setMessage("Movimentação atualizada com sucesso!")
        setTimeout(() => setMessage(null), 1000)
        process.movements.forEach(movement => {
          if (movement.id == id)
            movement.type = type
        }) 
      })
      .finally(closeModal)
  }

  return (
    <Box>
      <Box display={"flex"} width={"100%"} flexDirection={"column"}>
        <FormControl>
          <InputLabel>Tipo da movimentação</InputLabel>
          <Select id="type-select" label="Tipo da movimentação" onChange={handleChange} value={type}>
            <MenuItem value="PENHORA">PENHORA</MenuItem>
            <MenuItem value="PEDIDO DE PRAZO">PEDIDO DE PRAZO</MenuItem>
            <MenuItem value="DECISÃO INTERLOCUTÓRIA">DECISÃO INTERLOCUTÓRIA</MenuItem>
            <MenuItem value="JUNTADA DE DOCUMENTOS">JUNTADA DE DOCUMENTOS</MenuItem>
            <MenuItem value="MANIFESTAÇÃO DO MINISTÉRIO PÚBLICO">MANIFESTAÇÃO DO MINISTÉRIO PÚBLICO</MenuItem>
          </Select>
          <Box display={"flex"} justifyContent={"end"} marginTop={"10px"}>
            <Button sx={{ color: "#aaa" }} onClick={closeModal}>Cancelar</Button>
            <Button type="submit" onClick={handleSubmit}>Salvar</Button>
          </Box>
        </FormControl>
      </Box>
    </Box>
  )
}

export default Process