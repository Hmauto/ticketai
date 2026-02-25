// Types for TicketAI Frontend

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'billing' | 'technical' | 'feature_request' | 'bug' | 'general';
export type SentimentType = 'positive' | 'neutral' | 'negative' | 'very_negative';
export type UserRole = 'admin' | 'manager' | 'agent';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  skills?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Classification {
  id: string;
  ticketId: string;
  category: TicketCategory;
  priority: TicketPriority;
  sentiment: SentimentType;
  confidence: number;
  modelVersion: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  tenantId: string;
  subject: string;
  body: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  sentiment: SentimentType;
  confidence: number;
  assignedTo?: string;
  assignedToUser?: User;
  customerEmail: string;
  customerName?: string;
  source: 'email' | 'api' | 'webhook' | 'csv';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  firstResponseAt?: string;
  classification?: Classification;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  content: string;
  isInternal: boolean;
  senderType: 'customer' | 'agent' | 'system';
  sender?: User;
  senderEmail?: string;
  createdAt: string;
}

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  assignedTo?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Analytics Types
export interface DailyMetrics {
  date: string;
  ticketCount: number;
  resolvedCount: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  satisfactionScore?: number;
}

export interface CategoryMetrics {
  category: TicketCategory;
  count: number;
  avgResolutionTime: number;
  resolutionRate: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  ticketsResolved: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  resolutionRate: number;
}

export interface SentimentTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PriorityDistribution {
  priority: TicketPriority;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  avgResponseTime: number;
  resolutionRate: number;
  avgSentiment: number;
  ticketsToday: number;
}

// Settings Types
export interface RoutingRule {
  id: string;
  name: string;
  condition: {
    field: 'category' | 'priority' | 'sentiment' | 'keywords';
    operator: 'equals' | 'contains' | 'starts_with';
    value: string;
  };
  action: {
    type: 'assign_to_team' | 'assign_to_agent' | 'set_priority' | 'add_tags';
    value: string;
  };
  isActive: boolean;
  order: number;
}

export interface Integration {
  id: string;
  name: string;
  type: 'slack' | 'zendesk' | 'email' | 'webhook';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  lastSyncAt?: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  skills: string[];
  maxTickets: number;
  isActive: boolean;
}

// AI Suggestion Types
export interface ResponseSuggestion {
  id: string;
  ticketId: string;
  content: string;
  confidence: number;
  source: 'template' | 'ai_generated' | 'kb_article';
  templateId?: string;
  kbArticleId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
