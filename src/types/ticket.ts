export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic?: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic?: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  assignedAt?: string;
}

export interface TicketMessage {
  id: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic?: string;
    role: string;
  };
  attachments?: TicketAttachment[];
  isInternal: boolean;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TicketCategory {
  TECHNICAL = "TECHNICAL",
  BILLING = "BILLING",
  ACCOUNT = "ACCOUNT",
  PROPERTY = "PROPERTY",
  VERIFICATION = "VERIFICATION",
  GENERAL = "GENERAL",
  BUG_REPORT = "BUG_REPORT",
  FEATURE_REQUEST = "FEATURE_REQUEST",
}

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  assignedTo?: string[];
  createdBy?: string[];
  search?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface CreateTicketInput {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  assignedTo?: string;
  tags?: string[];
  dueDate?: string;
  attachments?: File[];
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  tags?: string[];
  dueDate?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  pending: number;
  resolved: number;
  closed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byCategory: {
    [key in TicketCategory]: number;
  };
  avgResolutionTime: number;
  responseTime: number;
}
