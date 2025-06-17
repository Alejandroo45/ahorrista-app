import axios from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ExpenseCategory,
  ExpenseSummary,
  ExpenseDetail,
  CreateExpenseRequest,
  Goal,
  CreateGoalRequest
} from '../types';

const BASE_URL = 'http://198.211.105.95:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('/authentication/register', data).then(res => res.data),
  
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/authentication/login', data).then(res => res.data),
};

export const expensesAPI = {
  getSummary: (year: number, month: number): Promise<ExpenseSummary[]> =>
    api.get(`/expenses_summary?year=${year}&month=${month}`).then(res => res.data),
  
  getDetailByCategory: (year: number, month: number, categoryId: number): Promise<ExpenseDetail[]> =>
    api.get(`/expenses/detail?year=${year}&month=${month}&categoryId=${categoryId}`).then(res => res.data),
  
  createExpense: (data: CreateExpenseRequest): Promise<ExpenseDetail> =>
    api.post('/expenses', data).then(res => res.data),
  
  deleteExpense: (id: number): Promise<void> =>
    api.delete(`/expenses/${id}`).then(res => res.data),
};

export const categoriesAPI = {
  getAll: (): Promise<ExpenseCategory[]> =>
    api.get('/expenses_category').then(res => res.data),
};

export const goalsAPI = {
  getAll: (): Promise<Goal[]> =>
    api.get('/goals').then(res => res.data),
  
  create: (data: CreateGoalRequest): Promise<Goal> =>
    api.post('/goals', data).then(res => res.data),
  
  update: (id: number, data: Partial<CreateGoalRequest>): Promise<Goal> =>
    api.patch(`/goals/${id}`, data).then(res => res.data),
};