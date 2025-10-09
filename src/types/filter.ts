
export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterScreenProps {
  onApplyFilter: (filters: FilterState) => void;
  onClose: () => void;
  initialFilters?: Partial<FilterState>;
}

export interface FilterChipProps {
  title: string;
  icon?: string;
  isActive?: boolean;
  onPress: () => void;
}

// src/types/filter.ts
export interface FilterState {
  propertyType?: string;
  roomType?: string;
  amenities?: string[];
  minPrice?: number; // For properties
  maxPrice?: number; // For properties
  minAmount?: number; // For myProperties
  maxAmount?: number; // For myProperties
  city?: string;
  state?: string;
  listingType?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
  bedrooms?: number;
  bathrooms?: number;
  isFurnished?: boolean;
  isForStudents?: boolean;
}

export interface FilterScreenProps {
  onApplyFilter: (filters: FilterState) => void;
  onClose: () => void;
  initialFilters?: FilterState;
  filterType: 'properties' | 'myProperties';
}

export interface PropertyFilterInput {
  propertyType?: string;
  roomType?: string;
  amenities?: string[];
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  isFurnished?: boolean;
  isForStudents?: boolean;
  listingType?: 'RENT' | 'SALE' | 'LEASE';
}

export interface MyPropertiesFilterInput {
  city?: string | null;
  createdAfter?: string | null;
  createdBefore?: string | null;
  listingType?: string | null;
  maxAmount?: number | null;
  minAmount?: number | null;
  propertyType?: string | null;
  state?: string | null;
  status?: string | null;
  updatedAfter?: string | null;
}