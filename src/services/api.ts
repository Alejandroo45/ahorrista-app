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
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // DEBUG: Verificar exactamente qué token se está enviando
    console.log('🔑 Token being sent:', token);
    console.log('🔑 Full Authorization header:', `Bearer ${token}`);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('⚠️ No token found in localStorage');
  }
  
  // DEBUG: Log complete request details
  console.log('📤 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    headers: config.headers,
    data: config.data
  });
  
  return config;
});

// Interceptor de respuesta para debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message
    });
    
    // Si es 401, mostrar información específica del token
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      console.log('🔍 401 Debug Info:', {
        tokenExists: !!token,
        tokenLength: token?.length,
        tokenPreview: token?.substring(0, 20) + '...',
        authHeader: error.config?.headers?.Authorization
      });
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    console.log('🚀 Attempting registration with:', { email: data.email });
    
    try {
      const response = await api.post('/authentication/register', data);
      console.log('✅ Registration successful:', response.data);
      
      // Verificar diferentes estructuras de respuesta
      let authData;
      if (response.data && response.data.data && response.data.data.token) {
        authData = response.data;
      } else if (response.data && response.data.token) {
        authData = {
          status: 200,
          message: 'success',
          data: {
            token: response.data.token,
            email: response.data.email || data.email
          }
        };
      } else if (response.data && response.data.accessToken) {
        authData = {
          status: 200,
          message: 'success',
          data: {
            token: response.data.accessToken,
            email: response.data.email || data.email
          }
        };
      } else {
        throw new Error('Token not found in response');
      }
      
      console.log('✅ Normalized auth response:', authData);
      return authData;
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error;
    }
  },
  
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log('🚀 Attempting login with:', { email: data.email });
    
    try {
      const response = await api.post('/authentication/login', data);
      console.log('✅ Login successful:', response.data);
      
      // Verificar diferentes estructuras de respuesta
      let authData;
      if (response.data && response.data.data && response.data.data.token) {
        authData = response.data;
      } else if (response.data && response.data.token) {
        authData = {
          status: 200,
          message: 'success',
          data: {
            token: response.data.token,
            email: response.data.email || data.email
          }
        };
      } else if (response.data && response.data.accessToken) {
        authData = {
          status: 200,
          message: 'success',
          data: {
            token: response.data.accessToken,
            email: response.data.email || data.email
          }
        };
      } else {
        throw new Error('Token not found in response');
      }
      
      console.log('✅ Normalized auth response:', authData);
      return authData;
      
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  },
};

export const expensesAPI = {
  getSummary: async (year: number, month: number): Promise<ExpenseSummary[]> => {
    console.log(`🚀 Fetching expenses summary for ${year}-${month}`);
    
    try {
      const response = await api.get(`/expenses_summary?year=${year}&month=${month}`);
      console.log('✅ Summary fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch summary:', error.response?.data || error.message);
      
      // Fallback solo si el error no es de autenticación
      if (error.response?.status === 401) {
        throw error; // Re-throw para que se maneje en el componente
      }
      
      // Para otros errores, usar fallback
      console.log('📊 Using fallback data for summary');
      return [
        { categoryId: 1, categoryName: 'Alimentación', totalAmount: 450.50, transactionCount: 15 },
        { categoryId: 2, categoryName: 'Transporte', totalAmount: 120.00, transactionCount: 8 },
        { categoryId: 3, categoryName: 'Entretenimiento', totalAmount: 85.75, transactionCount: 5 },
        { categoryId: 4, categoryName: 'Servicios', totalAmount: 200.00, transactionCount: 4 },
        { categoryId: 5, categoryName: 'Salud', totalAmount: 150.25, transactionCount: 3 }
      ];
    }
  },
  
  getDetailByCategory: async (year: number, month: number, categoryId: number): Promise<ExpenseDetail[]> => {
    console.log(`🚀 Fetching expense details for category ${categoryId} in ${year}-${month}`);
    
    try {
      const response = await api.get(`/expenses/detail?year=${year}&month=${month}&categoryId=${categoryId}`);
      console.log('✅ Details fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch details:', error.response?.data || error.message);
      
      // Fallback solo si el error no es de autenticación
      if (error.response?.status === 401) {
        throw error; // Re-throw para que se maneje en el componente
      }
      
      console.log('📝 Using fallback data for details');
      const categoryNames: { [key: number]: string } = {
        1: 'Alimentación', 2: 'Transporte', 3: 'Entretenimiento',
        4: 'Servicios', 5: 'Salud', 6: 'Ropa', 7: 'Educación'
      };
      
      const categoryName = categoryNames[categoryId] || 'Otros';
      
      return [
        {
          id: categoryId * 100 + 1,
          amount: 25.50,
          description: 'Almuerzo en restaurante',
          date: `${year}-${String(month).padStart(2, '0')}-15`,
          categoryId,
          categoryName
        },
        {
          id: categoryId * 100 + 2,
          amount: 45.00,
          description: 'Supermercado semanal',
          date: `${year}-${String(month).padStart(2, '0')}-14`,
          categoryId,
          categoryName
        }
      ];
    }
  },
  
  createExpense: async (data: CreateExpenseRequest): Promise<ExpenseDetail> => {
    console.log('🚀 Creating new expense:', data);
    
    try {
      const response = await api.post('/expenses', data);
      console.log('✅ Expense created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create expense:', error.response?.data || error.message);
      throw error;
    }
  },
  
  deleteExpense: async (id: number): Promise<void> => {
    console.log(`🚀 Deleting expense ${id}`);
    
    try {
      await api.delete(`/expenses/${id}`);
      console.log('✅ Expense deleted successfully');
    } catch (error: any) {
      console.error('❌ Failed to delete expense:', error.response?.data || error.message);
      throw error;
    }
  },
};

export const categoriesAPI = {
  getAll: async (): Promise<ExpenseCategory[]> => {
    console.log('🚀 Fetching categories');
    
    try {
      const response = await api.get('/expenses_category');
      console.log('✅ Categories fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch categories:', error.response?.data || error.message);
      
      console.log('📂 Using fallback categories');
      return [
        { id: 1, name: 'Alimentación' },
        { id: 2, name: 'Transporte' },
        { id: 3, name: 'Entretenimiento' },
        { id: 4, name: 'Servicios' },
        { id: 5, name: 'Salud' },
        { id: 6, name: 'Ropa' },
        { id: 7, name: 'Educación' },
        { id: 8, name: 'Otros' }
      ];
    }
  },
};

export const goalsAPI = {
  getAll: async (): Promise<Goal[]> => {
    console.log('🚀 Fetching goals');
    
    try {
      const response = await api.get('/goals');
      console.log('✅ Goals fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch goals:', error.response?.data || error.message);
      
      console.log('🎯 Using fallback goals');
      const now = new Date();
      return [{
        id: 1,
        targetAmount: 800,
        currentAmount: 0,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        description: 'Meta mensual'
      }];
    }
  },
  
  create: async (data: CreateGoalRequest): Promise<Goal> => {
    console.log('🚀 Creating new goal:', data);
    
    try {
      const response = await api.post('/goals', data);
      console.log('✅ Goal created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create goal:', error.response?.data || error.message);
      throw error;
    }
  },
  
  update: async (id: number, data: Partial<CreateGoalRequest>): Promise<Goal> => {
    console.log(`🚀 Updating goal ${id}:`, data);
    
    try {
      const response = await api.patch(`/goals/${id}`, data);
      console.log('✅ Goal updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to update goal:', error.response?.data || error.message);
      throw error;
    }
  },
};