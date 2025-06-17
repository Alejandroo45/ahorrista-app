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
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/authentication/register', data);
      console.log('Respuesta completa del registro:', response);
      console.log('Datos de la respuesta:', response.data);
      
      // Verificar diferentes estructuras posibles
      if (response.data && response.data.token) {
        return response.data;
      } else if (response.data) {
        return {
          status: 200,
          message: 'success',
          data: {
            token: response.data.token || response.data.accessToken || 'temp-token',
            email: response.data.email || data.email
          }
        };
      } else {
        // Si no hay data, crear respuesta mock
        return {
          status: 200,
          message: 'success',
          data: {
            token: 'temp-token-' + Date.now(),
            email: data.email
          }
        };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
  
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/authentication/login', data);
      console.log('Respuesta completa del login:', response);
      console.log('Datos de la respuesta:', response.data);
      
      // Verificar diferentes estructuras posibles
      if (response.data && response.data.token) {
        return response.data;
      } else if (response.data) {
        return {
          status: 200,
          message: 'success',
          data: {
            token: response.data.token || response.data.accessToken || 'temp-token',
            email: response.data.email || data.email
          }
        };
      } else {
        return {
          status: 200,
          message: 'success',
          data: {
            token: 'temp-token-' + Date.now(),
            email: data.email
          }
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
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