import { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FF6B6B', '#6B66FF', '#FFD700', '#FF1493'
];

const CategoryPieChart = ({ transactions, categories, height = 300 }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = useMemo(() => {
    // Create a map to track spending by category
    const categoryTotals = {};
    
    // Initialize categories with zero values
    categories.forEach(category => {
      categoryTotals[category.id] = {
        name: category.name,
        value: 0,
      };
    });
    
    // Track uncategorized transactions
    categoryTotals['uncategorized'] = {
      name: 'Uncategorized',
      value: 0,
    };
    
    // Sum up transactions by category (only expenses - negative values)
    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only count expenses
        const amount = Math.abs(transaction.amount);
        const categoryId = transaction.category || 'uncategorized';
        
        if (categoryTotals[categoryId]) {
          categoryTotals[categoryId].value += amount;
        } else {
          categoryTotals['uncategorized'].value += amount;
        }
      }
    });
    
    // Convert to array and filter out categories with zero spending
    return Object.values(categoryTotals)
      .filter(category => category.value > 0)
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [transactions, categories]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-gray-700 text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };

  // If no data or all values are 0, show a message
  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No expense data to display
      </div>
    );
  }

  // For mobile, we'll simplify the visualization
  const pieProps = isMobile ? {
    innerRadius: "30%",
    outerRadius: "60%", 
    paddingAngle: 1,
    label: false,
    labelLine: false
  } : {
    innerRadius: "40%",
    outerRadius: "70%",
    paddingAngle: 2,
    label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`,
    labelLine: false
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          {...pieProps}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout={isMobile ? "horizontal" : "vertical"}
          verticalAlign={isMobile ? "bottom" : "middle"}
          align={isMobile ? "center" : "right"}
          wrapperStyle={{ 
            fontSize: isMobile ? 10 : 12,
            paddingLeft: isMobile ? 0 : 10
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

CategoryPieChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string,
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

export default CategoryPieChart; 