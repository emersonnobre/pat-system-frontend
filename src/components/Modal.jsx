import { Box, Button, Modal, Typography, useTheme } from "@mui/material"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #eee",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px"
};

export default function BasicModal({ open, setOpen, children }) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          border: "0px solid black",
          borderWidth: "0px"
        }}
      >
        <Box sx={style}>
          {children}
        </Box>
      </Modal>
    </div>
  );
}

export function DialogModal({ open, setOpen, cb }) {
  const theme = useTheme()
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 0,
    borderRadius: "10px"
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          border: "0px solid black",
          borderWidth: "0px"
        }}
      >
        <Box sx={style}>
          <Box bgcolor={theme.palette.warning.main} borderRadius={"5px"} paddingLeft={"20px"} paddingTop={"10px"} paddingBottom={"10px"}>
            <Typography variant="h6" color={"white"}>Atenção!</Typography>
          </Box>
          <Box padding={"10px"}>
            <Typography variant="p" color={"grey"}>Deseja realmente realizar essa ação?</Typography><br />
          </Box>
          <Box display={"flex"} justifyContent={"flex-end"} padding={"10px"}>
            <Button sx={{ color: "#aaa" }} onClick={handleClose}>Não</Button>
            <Button color="warning" onClick={() => {handleClose(); cb();}}>Sim</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}