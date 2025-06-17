export interface User {
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  passwd: string;
}

export interface RegisterRequest {
  email: string;
  passwd: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    token: string;
    email: string;
  };
}

export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
}

export interface ExpenseSummary {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
}

export interface ExpenseDetail {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  categoryName: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  categoryId: number;
  date: string;
}

export interface Goal {
  id: number;
  targetAmount: number;
  currentAmount: number;
  month: number;
  year: number;
  description?: string;
}

export interface CreateGoalRequest {
  targetAmount: number;
  month: number;
  year: number;
  description?: string;
}