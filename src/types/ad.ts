// Unified AdPosition enum
export enum AdPosition {
  APP_HOME_FEED_TOP = "APP_HOME_FEED_TOP",
  APP_HOME_FEED_MID = "APP_HOME_FEED_MID",
  APP_HOME_FEED_BOTTOM = "APP_HOME_FEED_BOTTOM",
  APP_SEARCH_RESULTS_TOP = "APP_SEARCH_RESULTS_TOP",
  APP_PROPERTY_DETAIL = "APP_PROPERTY_DETAIL",
  APP_BOOKING_CONFIRM = "APP_BOOKING_CONFIRM",
  WEB_LANDING_HERO = "WEB_LANDING_HERO",
  WEB_LANDING_FEATURED = "WEB_LANDING_FEATURED",
  WEB_LANDING_BOTTOM = "WEB_LANDING_BOTTOM",
  WEB_BLOG_SIDEBAR = "WEB_BLOG_SIDEBAR",
  WEB_FOOTER = "WEB_FOOTER",
  SEARCH_BAR = "SEARCH_BAR",
  BETWEEN_LISTINGS = "BETWEEN_LISTINGS",
  INTERSTITIAL = "INTERSTITIAL",
  TOP_BANNER = "TOP_BANNER",
  SIDEBAR = "SIDEBAR",
  INLINE = "INLINE",
  FOOTER = "FOOTER",
}

// Unified AdType enum
export enum AdType {
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM",
  SPONSORED = "SPONSORED",
  FEATURED = "FEATURED",
  BANNER = "BANNER",
}

// AdStatus remains unchanged
export enum AdStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  EXPIRED = "EXPIRED",
  ARCHIVED = "ARCHIVED",
}

// Ad interface with corrected type references
export interface Ad {
  readonly id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: AdPosition;
  type: AdType;
  status: AdStatus;
  startDate: Date;
  endDate: Date;
  budget: number;
  costPerClick: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Filters
export interface AdFilters {
  endDateAfter?: string | null;
  endDateBefore?: string | null;
  isActive?: boolean | null;
  positions?: AdPosition[] | null;
  search?: string | null;
  startDateAfter?: string | null;
  startDateBefore?: string | null;
  statuses?: AdStatus[] | null;
  types?: AdType[] | null;
  sort?: {
    field?: string | null;
    order?: string | null;
  } | null;
}

// Pagination
export interface AdPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Response
export interface AdResponse {
  items: Ad[];
  pagination: AdPagination;
}

// Create form values using consistent enums
export interface CreateAdFormValues {
  title: string;
  description: string;
  type: AdType;
  position: AdPosition;
  budget: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
}
