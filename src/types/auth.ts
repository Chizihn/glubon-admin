// types/auth.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: string;
  isActive: boolean;
  phoneNumber: string;
  profilePic?: string;
  isVerified: boolean;
  role: string;
  permissions: string[];
  status: string;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
