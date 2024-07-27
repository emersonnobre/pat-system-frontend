const errorMiddleware = (error) => {
  if (error.response) {
    const { status, data } = error.response

    const errorData = {
      status,
      message: data.message,
    }

    return Promise.reject(errorData)
  } else if (error.request) {
    return Promise.reject({ status: 0, message: "Sem resposta do servidor!" })
  } else {
    return Promise.reject({ status: 0, message: error.message })
  }
}

export default errorMiddleware