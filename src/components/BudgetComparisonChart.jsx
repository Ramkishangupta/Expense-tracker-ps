import { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const BudgetComparisonChart = ({ transactions, budgets, categories, height = 400 }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const chartData = useMemo(() => {
    // Get the current month for filtering transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Initialize data structure with all categories and their budgets
    const data = categories.map(category => {
      const budget = budgets.find(b => b.categoryId === category.id) || { amount: 0 };
      
      return {
        name: category.name,
        budget: budget.amount,
        actual: 0,
        id: category.id,
      };
    });
    
    // Calculate actual spending for current month by category
    transactions.forEach(transaction => {
      // Only include expenses (negative amounts) from current month
      const transactionDate = new Date(transaction.date);
      if (
        transaction.amount < 0 &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear &&
        transaction.category // Only categorized transactions
      ) {
        // Find the corresponding category in our data
        const categoryData = data.find(item => item.id === transaction.category);
        if (categoryData) {
          categoryData.actual += Math.abs(transaction.amount);
        }
      }
    });
    
    // Filter out categories with no budget and no spending
    const filteredData = data
      .filter(item => item.budget > 0 || item.actual > 0)
      .sort((a, b) => b.actual - a.actual); // Sort by actual spending
      
    // Limit items on mobile
    return isMobile ? filteredData.slice(0, 5) : filteredData;
  }, [transactions, budgets, categories, isMobile]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Mobile optimized formatter
  const customTickFormatter = (value) => {
    return isMobile 
      ? formatCurrency(value).replace('$', '') 
      : formatCurrency(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 md:p-3 border border-gray-200 shadow-md rounded-md text-xs md:text-sm">
          <p className="font-bold mb-1">{payload[0].payload.name}</p>
          <p className="text-blue-600">
            Budget: {formatCurrency(payload[0].payload.budget)}
          </p>
          <p className="text-red-600">
            Actual: {formatCurrency(payload[0].payload.actual)}
          </p>
          <p className={`font-semibold ${
            payload[0].payload.actual > payload[0].payload.budget 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            {payload[0].payload.actual > payload[0].payload.budget
              ? `Over by ${formatCurrency(payload[0].payload.actual - payload[0].payload.budget)}`
              : `Under by ${formatCurrency(payload[0].payload.budget - payload[0].payload.actual)}`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };

  // If no data, show message
  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No budget data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ 
          top: 20, 
          right: isMobile ? 10 : 30, 
          left: isMobile ? 5 : 20, 
          bottom: 5 
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          tickFormatter={customTickFormatter} 
          tick={{ fontSize: isMobile ? 10 : 12 }}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={isMobile ? 80 : 100} 
          tick={{ fontSize: isMobile ? 10 : 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? 12 : 14,
            paddingTop: 10 
          }}
        />
        <Bar dataKey="budget" fill="#8884d8" name="Budget" />
        <Bar dataKey="actual" fill="#ff7675" name="Actual" />
        <ReferenceLine y={0} stroke="#000" />
      </BarChart>
    </ResponsiveContainer>
  );
};

BudgetComparisonChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      categoryId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BudgetComparisonChart; 