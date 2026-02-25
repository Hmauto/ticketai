import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { 
  Ticket, 
  TicketListResponse, 
  TicketFilters, 
  TicketMessage,
  DailyMetrics,
  CategoryMetrics,
  AgentPerformance,
  SentimentTrend,
  PriorityDistribution,
  DashboardStats,
  ResponseSuggestion,
  User,
  RoutingRule,
  Integration,
  TeamMember,
  ApiResponse 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (data: { email: string; password: string; name: string; companyName: string }) =>
    apiClient.post('/auth/register', data),
  
  me: () => apiClient.get('/auth/me'),
  
  logout: () => apiClient.post('/auth/logout'),
};

// Tickets API
export const ticketsApi = {
  getTickets: (filters?: TicketFilters, page = 1, pageSize = 20) =>
    apiClient.get('/tickets', { params: { ...filters, page, pageSize } }),
  
  getTicket: (id: string) =>
    apiClient.get(`/tickets/${id}`),
  
  createTicket: (data: Partial<Ticket>) =>
    apiClient.post('/tickets', data),
  
  updateTicket: (id: string, data: Partial<Ticket>) =>
    apiClient.patch(`/tickets/${id}`, data),
  
  deleteTicket: (id: string) =>
    apiClient.delete(`/tickets/${id}`),
  
  assignTicket: (id: string, userId: string) =>
    apiClient.post(`/tickets/${id}/assign`, { userId }),
  
  changeStatus: (id: string, status: string) =>
    apiClient.patch(`/tickets/${id}/status`, { status }),
  
  bulkUpdate: (ids: string[], data: Partial<Ticket>) =>
    apiClient.post('/tickets/bulk', { ids, data }),
  
  getMessages: (ticketId: string) =>
    apiClient.get(`/tickets/${ticketId}/messages`),
  
  addMessage: (ticketId: string, content: string, isInternal = false) =>
    apiClient.post(`/tickets/${ticketId}/messages`, { content, isInternal }),
};

// AI Suggestions API
export const aiApi = {
  getSuggestions: (ticketId: string) =>
    apiClient.get(`/ai/suggestions/${ticketId}`),
  
  generateResponse: (ticketId: string) =>
    apiClient.post(`/ai/generate-response`, { ticketId }),
  
  classifyTicket: (ticketId: string) =>
    apiClient.post(`/ai/classify`, { ticketId }),
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: () =>
    apiClient.get('/analytics/dashboard'),
  
  getTicketVolume: (days = 30) =>
    apiClient.get('/analytics/volume', { params: { days } }),
  
  getCategoryBreakdown: () =>
    apiClient.get('/analytics/categories'),
  
  getAgentPerformance: (days = 30) =>
    apiClient.get('/analytics/agents', { params: { days } }),
  
  getSentimentTrends: (days = 30) =>
    apiClient.get('/analytics/sentiment', { params: { days } }),
  
  getPriorityDistribution: () =>
    apiClient.get('/analytics/priority'),
  
  getResponseTimeTrends: (days = 30) =>
    apiClient.get('/analytics/response-time', { params: { days } }),
  
  exportReport: (type: string, dateFrom: string, dateTo: string) =>
    apiClient.get('/analytics/export', { 
      params: { type, dateFrom, dateTo },
      responseType: 'blob'
    }),
};

// Settings API
export const settingsApi = {
  getTeamMembers: () =>
    apiClient.get('/settings/team'),
  
  inviteTeamMember: (data: { email: string; name: string; role: string }) =>
    apiClient.post('/settings/team/invite', data),
  
  updateTeamMember: (id: string, data: Partial<TeamMember>) =>
    apiClient.patch(`/settings/team/${id}`, data),
  
  removeTeamMember: (id: string) =>
    apiClient.delete(`/settings/team/${id}`),
  
  getRoutingRules: () =>
    apiClient.get('/settings/routing'),
  
  createRoutingRule: (data: Partial<RoutingRule>) =>
    apiClient.post('/settings/routing', data),
  
  updateRoutingRule: (id: string, data: Partial<RoutingRule>) =>
    apiClient.patch(`/settings/routing/${id}`, data),
  
  deleteRoutingRule: (id: string) =>
    apiClient.delete(`/settings/routing/${id}`),
  
  getIntegrations: () =>
    apiClient.get('/settings/integrations'),
  
  connectIntegration: (type: string, config: Record<string, any>) =>
    apiClient.post('/settings/integrations', { type, config }),
  
  disconnectIntegration: (id: string) =>
    apiClient.delete(`/settings/integrations/${id}`),
  
  updateProfile: (data: { name?: string; avatar?: string }) =>
    apiClient.patch('/settings/profile', data),
};

// Users API
export const usersApi = {
  getUsers: () =>
    apiClient.get('/users'),
  
  getUser: (id: string) =>
    apiClient.get(`/users/${id}`),
};

export default apiClient;
