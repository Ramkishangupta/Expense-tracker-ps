import { useState } from 'react';
import Card from '../components/Card';
import BudgetForm from '../components/BudgetForm';
import BudgetComparisonChart from '../components/BudgetComparisonChart';
import Modal from '../components/Modal';
import { useFinance } from '../contexts/FinanceContext';
import PropTypes from 'prop-types';

const Budget = () => {
  const { budgets, categories, transactions, stats, addBudget, deleteBudget } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);

  const handleOpenModal = (budget = null) => {
    setCurrentBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBudget(null);
  };

  const handleSubmit = (data) => {
    addBudget(data);
    handleCloseModal();
  };

  const handleDelete = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(budgetId);
    }
  };

  // Calculate budget and actual spending for each category
  const budgetData = categories.map(category => {
    const budget = budgets.find(b => b.categoryId === category.id);
    const categoryStats = stats.categoryBreakdown.find(c => c.name === category.name) || { amount: 0 };
    
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      budget: budget ? budget.amount : 0,
      actual: categoryStats.amount,
      remaining: budget ? budget.amount - categoryStats.amount : 0,
      percentUsed: budget && budget.amount > 0 
        ? Math.round((categoryStats.amount / budget.amount) * 100) 
        : 0
    };
  }).filter(item => item.budget > 0 || item.actual > 0);

  // For mobile display of budget details
  const MobileBudgetCard = ({ item }) => {
    const budget = budgets.find(b => b.categoryId === item.id);
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-3">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: item.color }}
          ></div>
          <h3 className="text-base font-medium">{item.name}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(item.budget)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Spent</p>
            <p className="text-sm font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(item.actual)}
            </p>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className={item.remaining < 0 ? 'text-red-600' : 'text-green-600'}>
              {item.remaining < 0 ? 'Over budget' : 'Remaining'}
            </span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(Math.abs(item.remaining))}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                item.percentUsed > 90 ? 'bg-red-600' : 
                item.percentUsed > 70 ? 'bg-yellow-400' : 
                'bg-green-600'
              }`}
              style={{ width: `${Math.min(100, item.percentUsed)}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1">
            {item.percentUsed}% used
          </p>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => handleOpenModal({ 
              id: budget?.id, 
              categoryId: item.id, 
              amount: item.budget 
            })}
            className="text-xs text-blue-600 hover:text-blue-900"
          >
            Edit
          </button>
          {budget && (
            <button
              onClick={() => handleDelete(budget.id)}
              className="text-xs text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };
  
  MobileBudgetCard.propTypes = {
    item: PropTypes.object.isRequired,
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Budget</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 w-full sm:w-auto"
        >
          Set Budget
        </button>
      </div>

      {budgetData.length > 0 ? (
        <>
          <Card title="Budget vs Actual Spending" className="mb-4 md:mb-6">
            <div className="h-60 sm:h-80 md:h-96">
              <BudgetComparisonChart 
                transactions={transactions}
                budgets={budgets}
                categories={categories}
                height="100%"
              />
            </div>
          </Card>

          {/* Mobile Budget Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {budgetData.map((item) => (
              <MobileBudgetCard key={item.id} item={item} />
            ))}
          </div>

          {/* Desktop Budget Table */}
          <Card title="Budget Details" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgetData.map((item) => {
                    const budget = budgets.find(b => b.categoryId === item.id);
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(item.budget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(item.actual)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          item.remaining < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(item.remaining)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                item.percentUsed > 90 ? 'bg-red-600' : 
                                item.percentUsed > 70 ? 'bg-yellow-400' : 
                                'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(100, item.percentUsed)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-center mt-1">
                            {item.percentUsed}% used
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal({ 
                              id: budget?.id, 
                              categoryId: item.id, 
                              amount: item.budget 
                            })}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          {budget && (
                            <button
                              onClick={() => handleDelete(budget.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-8 md:py-12">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No budgets set yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Setting budgets helps you manage your finances better by tracking your spending against your goals.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Set Your First Budget
            </button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${currentBudget ? 'Update' : 'Set'} Budget`}
        size={window.innerWidth < 640 ? 'sm' : 'md'}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={currentBudget}
          categories={categories}
        />
      </Modal>
    </div>
  );
};

export default Budget; 