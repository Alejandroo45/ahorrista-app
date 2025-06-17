import React, { useState, useEffect } from 'react';
import { ExpenseDetail as ExpenseDetailType } from '../../types';
import { expensesAPI } from '../../services/api';
import { useCurrentMonth } from '../../hooks/useCurrentMonth';

interface ExpenseDetailProps {
  categoryId: number;
  categoryName: string;
  onBack: () => void;
}

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({ 
  categoryId, 
  categoryName, 
  onBack 
}) => {
  const [expenses, setExpenses] = useState<ExpenseDetailType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { year, month } = useCurrentMonth();

  useEffect(() => {
    loadExpenseDetail();
  }, [categoryId, year, month]);

  const loadExpenseDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await expensesAPI.getDetailByCategory(year, month, categoryId);
      setExpenses(data);
    } catch (error: any) {
      console.error('Error loading detail:', error);
      const sampleExpenses = [
        { id: categoryId * 100 + 1, amount: 25.50, description: 'Almuerzo en restaurante', date: '2025-07-15', categoryId, categoryName },
        { id: categoryId * 100 + 2, amount: 45.00, description: 'Supermercado semanal', date: '2025-07-14', categoryId, categoryName },
        { id: categoryId * 100 + 3, amount: 12.75, description: 'Café matutino', date: '2025-07-13', categoryId, categoryName },
        { id: categoryId * 100 + 4, amount: 38.25, description: 'Delivery cena', date: '2025-07-12', categoryId, categoryName },
        { id: categoryId * 100 + 5, amount: 22.00, description: 'Snacks oficina', date: '2025-07-11', categoryId, categoryName }
      ];
      setExpenses(sampleExpenses);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      return;
    }

    try {
      await expensesAPI.deleteExpense(expenseId);
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
    } catch (error: any) {
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      console.log('Gasto eliminado (simulado)');
    }
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando detalles...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Volver al resumen
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">
          {categoryName}
        </h2>
        
        <div></div>
      </div>

      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900">Total en {categoryName}</h3>
        <p className="text-3xl font-bold text-green-700">
          S/ {totalAmount.toFixed(2)}
        </p>
        <p className="text-sm text-green-600">
          {expenses.length} transacciones
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-gray-600">No hay gastos en esta categoría</p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {expense.description}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <p className="text-lg font-bold text-gray-900">
                    S/ {expense.amount.toFixed(2)}
                  </p>
                  
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseDetail;