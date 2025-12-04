export interface Property {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  listingType: string;
  rentalPeriod: string;
  isFeatured: boolean; // mapped from 'featured' in backend? Backend has 'featured' field. Admin has 'isFeatured'. Let's check query. Backend schema has 'featured'. Admin query has 'isFeatured'. I should probably stick to backend name 'featured' or map it. The admin query currently maps it? No, admin query asks for 'isFeatured'. Backend schema has 'featured'. Wait, let me check backend schema again.
  // Backend schema (step 381) line 351: @Field(() => Boolean, { defaultValue: false }) featured: boolean;
  // Admin query (step 376) line 16: isFeatured.
  // This means the admin query is likely failing or using an alias if it works, or it's just wrong.
  // I will use 'featured' to match backend, but I need to be careful if I break existing code.
  // However, the goal is to align with backend.
  featured: boolean;
  isActive: boolean; // Backend doesn't have isActive. It has 'status'.
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profilePic?: string;
  };
  // Backend has viewsCount and likesCount directly (PropertyResolver)
  viewsCount?: number;
  likesCount?: number;
  
  // AdminResolver returns stats object
  stats?: {
    views: number;
    likes: number;
    conversations: number;
  };
  
  images: string[];
  sampleUnitImages: string[];
  livingRoomImages: string[];
  bedroomImages: string[];
  bathroomImages: string[];
  video?: string;

  // Flattened location
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;

  amenities: string[];
  propertyType: string;
  roomType: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  
  // New fields
  isFurnished: boolean;
  isForStudents: boolean;
  isStandalone: boolean;
  totalUnits?: number;
  availableUnits?: number;
  rentedUnits?: number;
  numberOfUnits?: number;
  
  visitingDays: string[];
  visitingTimeStart?: string;
  visitingTimeEnd?: string;
  
  propertyOwnershipDocs: string[];
  propertyPlanDocs: string[];
  propertyDimensionDocs: string[];
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
