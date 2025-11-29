export interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
  message?: string
}