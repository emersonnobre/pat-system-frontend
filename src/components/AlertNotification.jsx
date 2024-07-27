import { Alert, Snackbar } from "@mui/material"
import { useEffect, useState } from "react"
import PropTypes from "prop-types"

function AlertNotification({ message, severity = "error" }) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false)
    }, 5000)
    return () => clearTimeout(timer)
  })

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
      <Alert severity={severity} onClose={() => setOpen(false)}>
        {message}
      </Alert>
    </Snackbar>
  )
}

AlertNotification.propTypes = {
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
}

export default AlertNotification