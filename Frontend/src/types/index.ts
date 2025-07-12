export interface User {
  id: string;
  username: string;
  email: string;
  role: 'guest' | 'user' | 'admin';
  avatar?: string;
  reputation?: number;
  createdAt: string;
  isBanned?: boolean;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  authorId: string;
  author: User;
  votes: number;
  views: number;
  answersCount: number;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
}

export interface Answer {
  id: string;
  body: string;
  questionId: string;
  authorId: string;
  author: User;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}