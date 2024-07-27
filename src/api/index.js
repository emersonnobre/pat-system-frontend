import axios from "axios"
import errorMiddleware from "./error.middleware"

const api = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.response.use(undefined, errorMiddleware)

export default api