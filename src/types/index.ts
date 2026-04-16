// ============================================
// Tipagens globais do projeto
// ============================================

// --- User ---
export type UserRole = 'user' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDTO = Pick<IUser, 'name' | 'email' | 'password'> &
  Partial<Pick<IUser, 'role'>>;

export type UpdateUserDTO = Partial<
  Pick<IUser, 'name' | 'email' | 'password' | 'role'>
>;

export type UserResponse = Omit<IUser, 'password'>;

// --- Auth ---
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: UserResponse;
  token: string;
}

// --- API Responses ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- Sidebar Menu ---
export interface MenuItem {
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
}
