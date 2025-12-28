// Configuration for API and WebSocket URLs
// Reads from environment variables (.env file)

const getApiUrl = () => {
  // First, try environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Fallback: Auto-detect based on hostname
  const hostname = window.location.hostname
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api'
  } else {
    // Running on network (mobile/other device)
    return `http://${hostname}:5000/api`
  }
}

const getSocketUrl = () => {
  // First, try environment variable
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL
  }
  
  // Fallback: Auto-detect based on hostname
  const hostname = window.location.hostname
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000'
  } else {
    return `http://${hostname}:5000`
  }
}

export const API_URL = getApiUrl()
export const SOCKET_URL = getSocketUrl()

