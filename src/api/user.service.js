import api from "./index"

const userService = {
  authenticate: async (email, password) => {
    const response = await api.post("/user/auth", { email, password })
    return response.data.data
  } 
}

export default userService