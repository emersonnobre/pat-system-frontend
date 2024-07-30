import { Box, Modal } from "@mui/material"

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