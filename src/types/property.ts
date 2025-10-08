export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  stats: {
    views: number;
    likes: number;
    conversations: number;
  };
  images: string[];
  videos?: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  amenities?: string[];
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export interface PropertyFilters {
  status?: string;
  isFeatured?: boolean;
  search?: string;
}

export interface PropertyPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PropertyResponse {
  items: Property[];
  pagination: PropertyPagination;
}
