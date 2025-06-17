import React, { useState, useEffect } from 'react';
import { ExpenseSummary } from '../../types';
import { expensesAPI } from '../../services/api';
import { useCurrentMonth } from '../../hooks/useCurrentMonth';

interface ExpensesSummaryProps {
  onCategoryClick: (categoryId: number, categoryName: string) => void;
}

const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({ onCategoryClick }) => {
  const [summary, setSummary] = useState<ExpenseSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { year, month, goToPreviousMonth, goToNextMonth, formatMonth } = useCurrentMonth();

  useEffect(() => {
    loadSummary();
  }, [year, month]);

  const loadSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await expensesAPI.getSummary(year, month);
      setSummary(data);
    } catch (error: any) {
      setError('Error al cargar el resumen de gastos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = summary.reduce((sum, item) => sum + item.totalAmount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando resumen...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-gray-600 hover:text-blue-600"
        >
          ← Anterior
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">
          {formatMonth()}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 text-gray-600 hover:text-blue-600"
        >
          Siguiente →
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900">Total del mes</h3>
        <p className="text-3xl font-bold text-blue-700">
          S/ {totalAmount.toFixed(2)}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Gastos por categoría</h3>
        
        {summary.length === 0 ? (
          <p className="text-gray-600">No hay gastos registrados este mes</p>
        ) : (
          summary.map((item) => (
            <div
              key={item.categoryId}
              onClick={() => onCategoryClick(item.categoryId, item.categoryName)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.categoryName}</h4>
                  <p className="text-sm text-gray-600">
                    {item.transactionCount} transacciones
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    S/ {item.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {((item.totalAmount / totalAmount) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpensesSummary;