import api from "./index"

const processService = {
  get: async (token, limit, offset, orderBy, order) => {
    const response = await api
      .get(
        `/processes?limit=${limit}&offset=${offset}&orderBy=${orderBy}&order=${order}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
    return response.data.data
  },
  getById: async (token, id) => {
    const response = await api.get(`/processes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    return response.data.data
  },
  updateDocument: async (token, id, document) => {
    const response = await api.put(`/processes/${id}/document`, { document, updated_by_id: 1 }, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  },
  updateValidDatePrescription: async (token, id, validated) => {
    const response = await api.put(`/processes/${id}/prescription/valid`, { _prescription_date_validated: validated, updated_by_id: 1 }, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  }
}

export default processService