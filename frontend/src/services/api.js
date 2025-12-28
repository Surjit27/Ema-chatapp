import axios from 'axios'
import { API_URL } from '../config'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
}

// User API
export const userAPI = {
  search: (query) => api.get(`/users/search?q=${query}`),
  getById: (userId) => api.get(`/users/${userId}`)
}

// Chat API
export const chatAPI = {
  create: (data) => api.post('/chats', data),
  getAll: () => api.get('/chats'),
  getById: (chatId) => api.get(`/chats/${chatId}`),
  update: (chatId, data) => api.put(`/chats/${chatId}`, data),
  delete: (chatId) => api.delete(`/chats/${chatId}`),
  addParticipant: (chatId, userId) => api.post(`/chats/${chatId}/participants`, { userId }),
  removeParticipant: (chatId, userId) => api.delete(`/chats/${chatId}/participants/${userId}`)
}

// Message API
export const messageAPI = {
  send: (chatId, data) => api.post(`/chats/${chatId}/messages`, data),
  getMessages: (chatId, limit = 50, offset = 0) => 
    api.get(`/chats/${chatId}/messages?limit=${limit}&offset=${offset}`),
  update: (messageId, data) => api.put(`/messages/${messageId}`, data),
  delete: (messageId) => api.delete(`/messages/${messageId}`),
  markAsRead: (messageId) => api.post(`/messages/${messageId}/read`)
}

export default api

