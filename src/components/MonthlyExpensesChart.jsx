import { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const MonthlyExpensesChart = ({ transactions, height = 300 }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = useMemo(() => {
    const monthlyData = {};
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Initialize all months with zero values
    const currentYear = new Date().getFullYear();
    months.forEach((month, index) => {
      monthlyData[`${month} ${currentYear}`] = {
        name: month,
        expenses: 0,
        income: 0,
      };
    });
    
    // Aggregate transaction data by month
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      
      if (date.getFullYear() === currentYear) {
        if (transaction.amount < 0) {
          monthlyData[monthYear].expenses += Math.abs(transaction.amount);
        } else {
          monthlyData[monthYear].income += transaction.amount;
        }
      }
    });
    
    // Convert to array and only include months up to current
    const currentMonth = new Date().getMonth();
    return Object.values(monthlyData).slice(0, currentMonth + 1);
  }, [transactions]);

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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ 
          top: 20, 
          right: isMobile ? 10 : 30, 
          left: isMobile ? 0 : 20, 
          bottom: 5 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: isMobile ? 10 : 12 }}
        />
        <YAxis 
          tickFormatter={customTickFormatter} 
          tick={{ fontSize: isMobile ? 10 : 12 }}
          width={isMobile ? 40 : 60}
        />
        <Tooltip 
          formatter={(value) => formatCurrency(value)} 
          contentStyle={{ fontSize: isMobile ? 12 : 14 }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? 12 : 14,
            paddingTop: 10 
          }}
        />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
        <Bar dataKey="income" fill="#22c55e" name="Income" />
      </BarChart>
    </ResponsiveContainer>
  );
};

MonthlyExpensesChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MonthlyExpensesChart; 