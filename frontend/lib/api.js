import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

// Create axios instance
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for cookies (refresh token)
})

// Request Interceptor: Attach Access Token
apiInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("abk_token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle Token Refresh
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/login")) {
      originalRequest._retry = true

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
        const { accessToken } = res.data

        if (typeof window !== "undefined") {
          localStorage.setItem("abk_token", accessToken)
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiInstance(originalRequest)
      } catch (refreshError) {
        // Refresh failed (e.g., refresh token expired)
        if (typeof window !== "undefined") {
          localStorage.removeItem("abk_token")
          localStorage.removeItem("abk_user")
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await apiInstance.post("/auth/login", { email, password })
    if (res.data.accessToken && res.data.user) {
      localStorage.setItem("abk_token", res.data.accessToken)
      localStorage.setItem("abk_user", JSON.stringify(res.data.user))
    }
    return res.data
  },

  logout: async () => {
    try {
      await apiInstance.post("/auth/logout")
    } finally {
      localStorage.removeItem("abk_token")
      localStorage.removeItem("abk_user")
    }
  },

  me: async () => {
    const res = await apiInstance.get("/auth/me")
    return res.data
  },

  updateCredentials: async (data) => {
    const res = await apiInstance.put("/auth/credentials", data)
    return res.data
  },

  refresh: async () => {
    const res = await apiInstance.post("/auth/refresh")
    return res.data
  },

  // Services
  getServices: async () => {
    const res = await apiInstance.get("/services")
    return res.data
  },

  createService: async (serviceData) => {
    const res = await apiInstance.post("/services", serviceData)
    return res.data
  },

  updateService: async (id, serviceData) => {
    const res = await apiInstance.put(`/services/${id}`, serviceData)
    return res.data
  },

  deleteService: async (id) => {
    const res = await apiInstance.delete(`/services/${id}`)
    return res.data
  },

  // Projects
  getProjects: async () => {
    const res = await apiInstance.get("/projects")
    return res.data
  },

  createProject: async (projectData) => {
    const res = await apiInstance.post("/projects", projectData)
    return res.data
  },

  updateProject: async (id, projectData) => {
    const res = await apiInstance.put(`/projects/${id}`, projectData)
    return res.data
  },

  deleteProject: async (id) => {
    const res = await apiInstance.delete(`/projects/${id}`)
    return res.data
  },

  // Inquiries
  getInquiries: async () => {
    const res = await apiInstance.get("/inquiries")
    return res.data
  },

  updateInquiryStatus: async (id, status) => {
    const res = await apiInstance.put(`/inquiries/${id}`, { status })
    return res.data
  },

  deleteInquiry: async (id) => {
    const res = await apiInstance.delete(`/inquiries/${id}`)
    return res.data
  },

  // Partners
  getPartners: async () => {
    const res = await apiInstance.get("/partners")
    return res.data
  },

  createPartner: async (data) => {
    const res = await apiInstance.post("/partners", data)
    return res.data
  },

  updatePartner: async (id, data) => {
    const res = await apiInstance.put(`/partners/${id}`, data)
    return res.data
  },

  deletePartner: async (id) => {
    const res = await apiInstance.delete(`/partners/${id}`)
    return res.data
  },

  // Timeline
  getTimeline: async () => {
    const res = await apiInstance.get("/timeline")
    return res.data
  },

  createTimelineItem: async (data) => {
    const res = await apiInstance.post("/timeline", data)
    return res.data
  },

  updateTimelineItem: async (id, data) => {
    const res = await apiInstance.put(`/timeline/${id}`, data)
    return res.data
  },

  deleteTimelineItem: async (id) => {
    const res = await apiInstance.delete(`/timeline/${id}`)
    return res.data
  },


  submitInquiry: async (inquiryData) => {
    const res = await apiInstance.post("/inquiries", inquiryData)
    return res.data
  },

  // Settings
  getSettings: async () => {
    const res = await apiInstance.get("/settings")
    return res.data
  },

  updateSettings: async (settings) => {
    const res = await apiInstance.put("/settings", settings)
    return res.data
  },

  // Admin Stats
  getAdminStats: async () => {
    const res = await apiInstance.get("/admin/stats")
    return res.data
  },

  // Notifications
  getNotifications: async () => {
    const res = await apiInstance.get("/notifications")
    return res.data
  },

  markAsRead: async (id) => {
    const res = await apiInstance.put(`/notifications/${id}/read`)
    return res.data
  },

  markAllAsRead: async () => {
    const res = await apiInstance.put("/notifications/mark-all-read")
    return res.data
  },

  deleteNotification: async (id) => {
    const res = await apiInstance.delete(`/notifications/${id}`)
    return res.data
  },

  // News
  getNews: async () => {
    const res = await apiInstance.get("/news")
    return res.data
  },

  createNews: async (data) => {
    const res = await apiInstance.post("/news", data)
    return res.data
  },

  updateNews: async (id, data) => {
    const res = await apiInstance.patch(`/news/${id}`, data)
    return res.data
  },

  deleteNews: async (id) => {
    const res = await apiInstance.delete(`/news/${id}`)
    return res.data
  },

  // Uploads
  uploadImage: async (formData) => {
    const res = await apiInstance.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },
}
