import api from "./index"

const processService = {
  get: async (token, limit, offset, orderBy, order) => {
    const response = await api
      .get(
        `/processes?limit=${limit}&offset=${offset}&orderBy=${orderBy}&order=${order}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
    return response.data.data
  } 
}

export default processService