// Common types for AppSync resolvers
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
}

export interface PaginationInput {
  limit?: number;
  nextToken?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
}

// Common error handling utilities
export function handleError(error: any, fallbackMessage = 'An error occurred') {
  console.error('Resolver error:', error);
  throw new Error(error?.message || fallbackMessage);
}

// Common validation utilities
export function validateRequired(value: any, fieldName: string) {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}
