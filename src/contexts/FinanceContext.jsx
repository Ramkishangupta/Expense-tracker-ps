import { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'groceries', name: 'Groceries', color: '#0088FE' },
  { id: 'housing', name: 'Housing', color: '#00C49F' },
  { id: 'transportation', name: 'Transportation', color: '#FFBB28' },
  { id: 'utilities', name: 'Utilities', color: '#FF8042' },
  { id: 'entertainment', name: 'Entertainment', color: '#8884D8' },
];

// Create context
const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [categories, setCategories] = useLocalStorage('categories', DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useLocalStorage('budgets', []);

  // Memoized derived values
  const stats = useMemo(() => {
    // Current month transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    // Total income and expenses for current month
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Category breakdown for current month (expenses only)
    const categoryBreakdown = {};
    categories.forEach(category => {
      categoryBreakdown[category.id] = {
        name: category.name,
        color: category.color,
        amount: 0,
        budget: 0,
      };
    });
    
    // Add budget information
    budgets.forEach(budget => {
      if (categoryBreakdown[budget.categoryId]) {
        categoryBreakdown[budget.categoryId].budget = budget.amount;
      }
    });
    
    // Calculate spending by category (expenses only)
    currentMonthTransactions
      .filter(t => t.amount < 0 && t.category)
      .forEach(t => {
        if (categoryBreakdown[t.category]) {
          categoryBreakdown[t.category].amount += Math.abs(t.amount);
        }
      });
      
    return {
      monthlyIncome,
      monthlyExpenses,
      balance: monthlyIncome - monthlyExpenses,
      categoryBreakdown: Object.values(categoryBreakdown),
    };
  }, [transactions, categories, budgets]);

  // Transactions CRUD operations
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    return newTransaction;
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Categories CRUD operations
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: uuidv4(),
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const updateCategory = (updatedCategory) => {
    setCategories(
      categories.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteCategory = (id) => {
    // Delete category
    setCategories(categories.filter(category => category.id !== id));
    
    // Update related transactions (set their category to null)
    setTransactions(
      transactions.map(transaction => 
        transaction.category === id 
          ? { ...transaction, category: null } 
          : transaction
      )
    );
    
    // Delete related budgets
    setBudgets(budgets.filter(budget => budget.categoryId !== id));
  };

  // Budgets CRUD operations
  const addBudget = (budget) => {
    // Check if this category already has a budget
    const existingBudget = budgets.find(b => b.categoryId === budget.categoryId);
    
    if (existingBudget) {
      // Update existing budget
      const updatedBudget = { ...existingBudget, amount: budget.amount };
      setBudgets(
        budgets.map(b => b.id === existingBudget.id ? updatedBudget : b)
      );
      return updatedBudget;
    } else {
      // Create new budget
      const newBudget = {
        ...budget,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      setBudgets([...budgets, newBudget]);
      return newBudget;
    }
  };

  const updateBudget = (updatedBudget) => {
    setBudgets(
      budgets.map(budget => 
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const value = {
    transactions,
    categories,
    budgets,
    stats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

FinanceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export default FinanceContext; 