import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const preprocessCloth = async (file: File, category: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', category)

  const response = await api.post('/api/preprocess/cloth', formData)
  return response.data
}

export const preprocessPerson = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/api/preprocess/person', formData)
  return response.data
}

export const runVirtualTryOn = async (
  clothPath: string,
  personPath: string,
  category: string
) => {
  const formData = new FormData()
  formData.append('cloth_path', clothPath)
  formData.append('person_path', personPath)
  formData.append('category', category)

  const response = await api.post('/api/tryon', formData)
  return response.data
}

export const getResultUrl = (filename: string) => {
  return `${API_BASE_URL}/api/result/${filename}`
}

export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api
