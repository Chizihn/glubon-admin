export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  reference: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  property?: {
    id: string;
    title: string;
    price: number;
    location: {
      address: string;
      city: string;
      state: string;
    };
  };
  paymentMethod?: string;
  paymentProvider?: string;
  gatewayResponse?: string;
  metadata?: string;
}

export interface TransactionFilters {
  status?: string;
  type?: string;
  search?: string;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TransactionResponse {
  items: Transaction[];
  pagination: TransactionPagination;
}
