import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaTags, FaCalendarAlt } from 'react-icons/fa';

const TransactionList = ({ 
  transactions, 
  onEdit, 
  onDelete, 
  categories = [],
  limit = null,
  compact = false
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryName = (transaction) => {
    // For income transactions (positive amount), display "Income" instead of a category
    if (transaction.amount > 0) {
      return "Income";
    }
    
    // For expenses, display the category name or "Uncategorized" if no category
    const category = categories.find(c => c.id === transaction.category);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (transaction) => {
    if (transaction.amount > 0) {
      return "#10b981"; // Green for income
    }
    
    const category = categories.find(c => c.id === transaction.category);
    return category ? category.color : "#9ca3af"; // Default gray
  };
  
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  // Mobile view - card style for each transaction
  const renderMobileView = () => (
    <div className="space-y-3 md:hidden">
      {displayTransactions.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No transactions found</p>
      ) : (
        displayTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 card-hover-effect w-full">
            <div className="flex flex-wrap justify-between items-start mb-2">
              <div className="flex items-start flex-1 min-w-0 mr-2">
                <div 
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-2 text-white"
                  style={{ backgroundColor: getCategoryColor(transaction) }}
                >
                  {transaction.amount > 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium block truncate">{transaction.description}</span>
                  <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1">
                    <div className="flex items-center mr-2 mb-1">
                      <FaCalendarAlt className="mr-1" size={10} />
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaTags className="mr-1" size={10} />
                      <span className="truncate">{getCategoryName(transaction)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className={`font-medium ${
                transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatAmount(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => onEdit(transaction)}
                className="text-xs text-indigo-600 hover:text-indigo-800 mr-4 flex items-center"
              >
                <FaEdit size={12} className="mr-1" /> Edit
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                className="text-xs text-red-600 hover:text-red-800 flex items-center"
              >
                <FaTrash size={12} className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Table view - standard layout
  const renderTableView = () => (
    <div className="hidden md:block overflow-x-auto">
      {displayTransactions.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No transactions found</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              {!compact && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
                    {formatDate(transaction.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-white"
                      style={{ backgroundColor: getCategoryColor(transaction) }}
                    >
                      {transaction.amount > 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                    </div>
                    {transaction.description}
                  </div>
                </td>
                {!compact && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaTags className="mr-2 text-gray-400" size={12} />
                      {getCategoryName(transaction)}
                    </div>
                  </td>
                )}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                  transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatAmount(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-indigo-600 hover:text-indigo-800 mr-4 inline-flex items-center"
                  >
                    <FaEdit size={14} className="mr-1" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center"
                  >
                    <FaTrash size={14} className="mr-1" />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  
  return (
    <>
      {renderMobileView()}
      {renderTableView()}
    </>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ),
  limit: PropTypes.number,
  compact: PropTypes.bool,
};

export default TransactionList; 